import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faLock,
  faSpinner,
  faEye,
  faEyeSlash,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import Perfil from "pages/Perfil";

const API_URL = process.env.REACT_APP_API_URL;

function Login() {
  const navigate = useNavigate();

  // Estados comunes
  const [activeForm, setActiveForm] = useState("login"); // 'login' | 'register' | 'forgot'
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Login
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Register
  const [nameUser, setNameUser] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Forgot Password
  const [forgotEmail, setForgotEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Funciones utilitarias
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPassword = (password) => {
    if (password.length < 6) {
      return { valid: false, message: "La contraseña debe tener al menos 6 caracteres." };
    }
    // Puedes agregar más validaciones aquí
    return { valid: true };
  };

  // --- Manejo de Login ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      if (!form.email || !form.password) {
        setError("Por favor, ingresa tu correo y contraseña.");
        setLoading(false);
        return;
      }

      if (!isValidEmail(form.email)) {
        setError("Por favor, ingresa un correo electrónico válido.");
        setLoading(false);
        return;
      }

      const res = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });

      const data = await res.json();

      if (res.ok && data.user) {
        const { nombre, apellido, rol, email: userEmail, _id } = data.user;

        const userData = { nombre, apellido, email: userEmail, rol, _id };

        if (rol === "admin" && userEmail === "jobquest.g2@gmail.com") {
          localStorage.setItem("user", JSON.stringify(userData));
          sessionStorage.setItem("user_id", _id);
          setMessage("Bienvenido, administrador");
          navigate("/menu");
        } else {
          localStorage.setItem("entrevistado", JSON.stringify(userData));
          sessionStorage.setItem("user_id", _id);
          setMessage("Bienvenido al simulador de entrevistas");
          navigate("/user");
        }
      } else {
        setError(data.message || "Credenciales incorrectas");
      }
    } catch (err) {
      setError("Error al conectar con el servidor");
    }

    setLoading(false);
  };

  // --- Manejo de Registro ---
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setIsLoading(true);

    if (!nameUser || !email || !password || !confirmPassword) {
      setError("Todos los campos son obligatorios.");
      setIsLoading(false);
      return;
    }
    if (!isValidEmail(email)) {
      setError("Por favor, ingresa un formato de correo electrónico válido.");
      setIsLoading(false);
      return;
    }

    const passwordValidation = isValidPassword(password);
    if (!passwordValidation.valid) {
      setError(passwordValidation.message);
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: nameUser, correo: email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Registro exitoso. ¡Ahora puedes iniciar sesión!");
        setActiveForm("login"); // Cambiar al login
        // Limpiar formulario registro
        setNameUser("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
      } else {
        setError(data.message || "Error en el registro. Inténtalo de nuevo.");
      }
    } catch (err) {
      setError(err.message || "Error en el servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- Manejo de Olvidé Contraseña ---
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setIsLoading(true);

    if (!forgotEmail) {
      setError("Por favor, ingresa tu correo electrónico.");
      setIsLoading(false);
      return;
    }
    if (!isValidEmail(forgotEmail)) {
      setError("Por favor, ingresa un formato de correo electrónico válido.");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Correo de recuperación enviado. Revisa tu bandeja de entrada.");
        setMessage(data.message || "Si tu correo existe, se ha enviado un enlace de recuperación.");
        setForgotEmail("");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 5000);
      } else {
        setError(data.message || "Error al enviar recuperación. Inténtalo de nuevo.");
      }
    } catch (err) {
      setError("Hubo un problema con el servidor. Inténtalo más tarde.");
    } finally {
      setIsLoading(false);
    }
  };

  // Función para mostrar formularios
  const showForm = (formName) => {
    setError("");
    setMessage("");
    setLoading(false);
    setIsLoading(false);
    setActiveForm(formName);
  };

  return (
    <div className="auth-wrapper">
      {/* FORMULARIO LOGIN */}
      {activeForm === "login" && (
        <form onSubmit={handleLogin} className="form-container active">
          <h1>Iniciar Sesión</h1>

          {error && <p className="error">{error}</p>}
          {message && <p className="success">{message}</p>}

          <div className="input-group">
            <FontAwesomeIcon icon={faEnvelope} className="input-icon left" />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Correo electrónico"
              required
              aria-label="Correo electrónico"
            />
          </div>

          <div className="input-group">
            <FontAwesomeIcon icon={faLock} className="input-icon left" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Contraseña"
              required
              aria-label="Contraseña"
            />
            <FontAwesomeIcon
              icon={showPassword ? faEyeSlash : faEye}
              className="input-icon right password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            />
          </div>

          <div className="remember-me-container">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <label htmlFor="rememberMe">Recuérdame</label>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? (
              <>
                <FontAwesomeIcon icon={faSpinner} spin /> Cargando...
              </>
            ) : (
              "Entrar"
            )}
          </button>

          <div className="link-group">
            <button type="button" className="link-button" onClick={() => showForm("forgot")}>
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          <p className="text-center">
            ¿No tienes cuenta?{" "}
            <button type="button" className="link-button" onClick={() => showForm("register")}>
              Crear cuenta
            </button>
          </p>
        </form>
      )}

      {/* FORMULARIO REGISTRO */}
      {activeForm === "register" && (
        <div className="form-container active">
          <h2>Registro</h2>

          {message && <p className="toast success">{message}</p>}
          {error && <p className="toast error">{error}</p>}

          <form onSubmit={handleRegister}>
            <div className="input-group">
              <label htmlFor="register-username" className="sr-only">
                Nombre de usuario
              </label>
              <FontAwesomeIcon icon={faUser} className="input-icon left" />
              <input
                type="text"
                id="register-username"
                placeholder="Nombre de usuario"
                value={nameUser}
                onChange={(e) => setNameUser(e.target.value)}
                required
                aria-label="Nombre de usuario"
              />
            </div>

            <div className="input-group">
              <label htmlFor="register-email" className="sr-only">
                Correo electrónico
              </label>
              <FontAwesomeIcon icon={faEnvelope} className="input-icon left" />
              <input
                type="email"
                id="register-email"
                placeholder="Correo"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                aria-label="Correo electrónico"
              />
            </div>

            <div className="input-group">
              <label htmlFor="register-password" className="sr-only">
                Contraseña
              </label>
              <FontAwesomeIcon icon={faLock} className="input-icon left" />
              <input
                type={showPassword ? "text" : "password"}
                id="register-password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                aria-label="Contraseña"
              />
              <FontAwesomeIcon
                icon={showPassword ? faEye : faEyeSlash}
                className="input-icon right password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              />
            </div>

            <div className="input-group">
              <label htmlFor="register-confirm-password" className="sr-only">
                Confirmar contraseña
              </label>
              <FontAwesomeIcon icon={faLock} className="input-icon left" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="register-confirm-password"
                placeholder="Confirmar contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                aria-label="Confirmar contraseña"
              />
              <FontAwesomeIcon
                icon={showConfirmPassword ? faEye : faEyeSlash}
                className="input-icon right password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              />
            </div>

            <button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} spin /> Registrando...
                </>
              ) : (
                "Registrarse"
              )}
            </button>

            <p className="text-center">
              ¿Ya tienes cuenta?{" "}
              <button type="button" className="link-button" onClick={() => showForm("login")}>
                Iniciar sesión
              </button>
            </p>
          </form>
        </div>
      )}

      {/* FORMULARIO OLVIDÉ CONTRASEÑA */}
      {activeForm === "forgot" && (
        <div className="form-container active">
          <h2>Recuperar Contraseña</h2>

          {message && <p className="toast success">{message}</p>}
          {error && <p className="toast error">{error}</p>}

          <form onSubmit={handleForgotPassword}>
            <div className="input-group">
              <label htmlFor="forgot-email" className="sr-only">
                Correo electrónico
              </label>
              <FontAwesomeIcon icon={faEnvelope} className="input-icon left" />
              <input
                type="email"
                id="forgot-email"
                placeholder="Correo"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                required
                aria-label="Correo electrónico"
              />
            </div>

            <button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} spin /> Enviando...
                </>
              ) : (
                "Enviar enlace"
              )}
            </button>

            <p className="text-center">
              <button type="button" className="link-button" onClick={() => showForm("login")}>
                Volver a iniciar sesión
              </button>
            </p>
          </form>
          {/* Mensaje push */}
          {showToast && (
            <div className="toast success toast-push"> Correo enviado, revise su bandeja. </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Login;
