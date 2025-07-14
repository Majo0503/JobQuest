from flask import Blueprint, request, jsonify
from pymongo.errors import PyMongoError

auth_bp = Blueprint('auth_bp', __name__)
user_colection = None  # Esta variable se setea desde app.py

# Esta función se llama desde app.py
def register_auth_routes(app, user_col):
    global user_colection
    user_colection = user_col
    app.register_blueprint(auth_bp)  # 🔥 REGISTRA EL BLUEPRINT

@auth_bp.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'message': 'Faltan campos'}), 400

    user = user_colection.find_one({"correo": email, "password": password})
    if not user:
        return jsonify({'message': 'Credenciales inválidas'}), 401

    return jsonify({'message': 'Login exitoso', 'usuario': user.get('nombre')}), 200

@auth_bp.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    required = ["nameUser", "email", "password"]

    if not all(k in data for k in required):
        return jsonify({"message": "Faltan campos requeridos"}), 400

    existing_user = user_colection.find_one({"correo": data["email"]})
    if existing_user:
        return jsonify({"message": "El usuario ya existe"}), 400

    try:
        user_colection.insert_one({
            "nombre": data["nameUser"],
            "correo": data["email"],
            "password": data["password"],
        })
        return jsonify({"message": "Registro exitoso"}), 201
    except PyMongoError as e:
        return jsonify({"error": str(e)}), 500

@auth_bp.route('/api/forgot-password', methods=['POST'])
def forgot_password():
    data = request.get_json()
    email = data.get("email")

    if not email:
        return jsonify({"message": "El campo email es obligatorio"}), 400

    user = user_colection.find_one({"correo": email})
    if not user:
        return jsonify({"message": "No existe un usuario con ese correo"}), 404

    # Aquí normalmente enviarías un correo o generarías un token
    return jsonify({"message": f"Se ha enviado un correo de recuperación a {email}"}), 200


