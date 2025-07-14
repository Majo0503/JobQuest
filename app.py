from datetime import datetime, timezone
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from flask import Flask, request, jsonify, Blueprint
from flask_pymongo import PyMongo
from pymongo import errors
from pymongo import DESCENDING
from flask_cors import CORS
from itsdangerous import URLSafeTimedSerializer, SignatureExpired, BadSignature
from bson import ObjectId
import sib_api_v3_sdk
from datetime import datetime
from sib_api_v3_sdk.rest import ApiException
from sib_api_v3_sdk.configuration import Configuration
from bson import ObjectId
# Importación de modelos
from modelos import user, company, permit

# Inicializar Flask
app = Flask(__name__)
app.config['MONGO_URI'] = 'mongodb+srv://Admin:admin123@jobquest.nqj0ty2.mongodb.net/JobQuest?retryWrites=true&w=majority&tlsAllowInvalidCertificates=true'

# --- ADMIN EMAIL ---
ADMIN_EMAIL = "jobquest.g2@gmail.com"

# Inicializar Mongo
mongo = PyMongo(app)
CORS(app)

# Blueprints
users_bp = Blueprint('users', __name__)
companies_bp = Blueprint('companies', __name__)
entrevistas_bp = Blueprint('entrevistas', __name__)
accesos_bp = Blueprint("accesos", __name__)
# Configuración Brevo
configuration = Configuration()
configuration.api_key['api-key'] = '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'

# Token reset
serializer = URLSafeTimedSerializer("CLAVE_SECRETA_SEGURA")

# Colecciones
try:
    db = mongo.db
    user_colection = db["users"]
    company_colection = db["companies"]
    permit_colection = db["permits"]
except errors.ConnectionFailure as e:
    print(f"No se pudo conectar a la BD: {e}")
    db = None

# Helpers
def user_to_dict(user):
    return {
        "_id": str(user.get("_id")),
        "code": user.get("codigo"),
        "nameUser ": user.get("nombre"),
        "lastName": user.get("apellido"),
        "phone": user.get("telefono"),
        "birthDate": user.get("fecha_nacimiento"),
        "gender": user.get("genero"),
        "dpi": user.get("dpi"),
        "rol": user.get("rol"),
        "email": user.get("correo"),
        "password": user.get("password"),
        "laboralData": user.get("datos_laborales"),
        "educationData": user.get("datos_educativos"),
        "status": user.get("estado"),
        "creationDate": user.get("fecha_creacion"),
        "modificationDate": user.get("fecha_modification")
    }

def company_to_dict(company):
    return {
        "code": company.get("codigo"),
        "nameCompany": company.get("nombre"),
        "direction": company.get("direccion"),
        "phone": company.get("telefono"),
        "nit": company.get("nit"),
        "environment": company.get("entorno"),
        "sector": company.get("sector"),
        "email": company.get("correo"),
        "date": company.get("fecha"),
        "description": company.get("descripcion"),
        "status": company.get("estado"),
        "managerRH": company.get("encargadoRH"),
        "state": company.get("estadoPerteneciente")
    }

def permit_to_dict(permit):
    return {
        "administrator": permit.get("administrador"),
        "recruiter": permit.get("reclutador")
    }

# COMPROBACION DEL SISTEMA
@app.route("/")
def home():
    return "<h1>BACKEND DE RECLUTAMIENTO</h1>"

@app.route("/colecciones")
def obtener_coleccion():
    if db is None:
        return jsonify({"error": "No existe conexion a Mongo"}), 500
    colecciones = db.list_collection_names()
    return jsonify(colecciones), 200

# ENPOINTS

@app.route('/api/users', methods=['GET'])
def get_users():
    try:
        users = list(user_colection.find())
        for user in users:
            user['_id'] = str(user['_id'])
        return jsonify(users), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
# Registrar acceso al home
@accesos_bp.route("/api/accesos/home", methods=["POST"])
def registrar_acceso_home():
    data = {
        "ruta": "/home",
        "fecha_acceso": datetime.utcnow(),
        "usuario_id": request.json.get("usuario_id")  # opcional
    }
    mongo.db.accesos.insert_one(data)
    return jsonify({"message": "Acceso registrado"}), 201

# Obtener accesos al home
@accesos_bp.route("/api/accesos/home", methods=["GET"])
def obtener_accesos_home():
    accesos = mongo.db.accesos.find({"ruta": "/home"})
    output = []
    for a in accesos:
        output.append({
            "ruta": a.get("ruta"),
            "fecha_acceso": a.get("fecha_acceso"),
            "usuario_id": str(a.get("usuario_id", "")),
        })
    return jsonify(output)
# ✅ REGISTRO: solo nombre, correo, password obligatorios
@app.route('/api/register', methods=['POST'])
def register_user():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"message": "No se envió JSON"}), 400

        nombre = data.get('nombre')
        correo = data.get('correo')
        password = data.get('password')

        # --- Campos opcionales ---
        apellido = data.get('apellido')
        telefono = data.get('telefono')
        fecha_nacimiento = data.get('fecha_nacimiento')
        genero = data.get('genero')
        dpi = data.get('dpi')
        # --- CREAR UN ADMIN DESDE ACA ---
        rol = "admin" if correo == ADMIN_EMAIL else data.get('rol', 'Cliente')

        if not nombre or not correo or not password:
            return jsonify({"message": "Campos incompletos"}), 400

        if user_colection.find_one({"correo": correo}):
            return jsonify({"message": "El usuario ya existe"}), 400

        user_data = {
            "nombre": nombre,
            "correo": correo,
            "password": password,
            "rol": rol,
            "apellido": apellido,
            "telefono": telefono,
            "fecha_nacimiento": fecha_nacimiento,
            "genero": genero,
            "dpi": dpi,
            "estado": "activo",
            "fecha_creacion": datetime.now(timezone.utc),
            "fecha_modificacion": datetime.now(timezone.utc)
        }

        user_colection.insert_one(user_data)
        return jsonify({"message": "Usuario registrado con éxito"}), 201

    except Exception as e:
        return jsonify({"message": str(e)}), 500

# ✅ LOGIN actualizado
@app.route('/api/login', methods=['POST'])
def login_user():
    try:
        data = request.get_json(force=True)
        correo = data.get("email")
        password = data.get("password")

        user = user_colection.find_one({"correo": correo})
        if not user or user.get("password") != password:
            return jsonify({"message": "Credenciales incorrectas"}), 401

        # Si es el administrador, actualiza el rol
        if correo == ADMIN_EMAIL:
            user["rol"] = "admin"
        else:
            user["rol"] = user.get("rol", "entrevistado")

        user_data = user_to_dict(user)
        user_data["_id"] = str(user["_id"])
        return jsonify({
            "message": "Login exitoso",
            "user": user_data
        }), 200

    except Exception as e:
        return jsonify({"message": str(e)}), 500

# ✅ ACTUALIZAR
@users_bp.route('/api/users/<user_id>', methods=['PUT'])
def update_user_by_id(user_id):
    try:
        data = request.json
        update_data = {
            "nombre": data.get("nombre"),
            "correo": data.get("correo"),
            "password": data.get("password"),
            "rol": data.get("rol"),
            "apellido": data.get("apellido"),
            "telefono": data.get("telefono"),
            "fecha_nacimiento": data.get("fecha_nacimiento"),
            "genero": data.get("genero"),
            "dpi": data.get("dpi"),
            "estado": data.get("estado", "activo"),
            "fecha_modificacion": datetime.now(timezone.utc)
        }

        # Filtra None
        update_data = {k: v for k, v in update_data.items() if v is not None}

        result = mongo.db.users.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": update_data}
        )
        return jsonify({"msg": "Usuario actualizado", "modified_count": result.modified_count})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ✅ GET BY ID
@users_bp.route('/api/users/<user_id>', methods=['GET'])
def get_user_by_id(user_id):
    try:
        user = user_colection.find_one({"_id": ObjectId(user_id)})
        if not user:
            return jsonify({"error": "Usuario no encontrado"}), 404
        return jsonify(user_to_dict(user)), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ✅ DELETE
@users_bp.route('/api/users/<user_id>', methods=['DELETE'])
def delete_user_by_id(user_id):
    try:
        result = mongo.db.users.delete_one({"_id": ObjectId(user_id)})
        return jsonify({"msg": "Usuario eliminado", "deleted_count": result.deleted_count})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def enviar_correo_reset(correo_destino, enlace):
    api_instance = sib_api_v3_sdk.TransactionalEmailsApi(sib_api_v3_sdk.ApiClient(configuration))
    email = sib_api_v3_sdk.SendSmtpEmail(
        to=[{"email": correo_destino}],
        subject="Restablecer contraseña - JobQuest",
        html_content=f"<p>Haz clic para restablecer tu contraseña: <a href='{enlace}'>{enlace}</a></p>",
        sender={"name": "JobQuest", "email": "jobquest.g2@gmail.com"}
    )
    api_instance.send_transac_email(email)
    return True

@app.route('/api/forgot-password', methods=['POST'])
def forgot_password():
    data = request.get_json()
    correo = data.get("email")
    user = user_colection.find_one({"correo": correo})
    if not user:
        return jsonify({"message": "Correo no registrado"}), 404
    token = serializer.dumps(correo, salt='reset-password')
    link = f"http://localhost:3000/reset-password/{token}"
    enviar_correo_reset(correo, link)
    return jsonify({"message": "Enlace de recuperación enviado"}), 200

@app.route('/api/reset-password/<token>', methods=['POST'])
def reset_password(token):
    data = request.get_json()
    nueva_pass = data.get("password")
    correo = serializer.loads(token, salt='reset-password', max_age=3600)
    user_colection.update_one({"correo": correo}, {"$set": {"password": nueva_pass}})
    return jsonify({"message": "Contraseña actualizada correctamente"}), 200

@entrevistas_bp.route('/api/entrevista/fase', methods=['POST'])
def guardar_fase_entrevista():
    data = request.get_json()
    user_id = data.get("userId")
    user = mongo.db.users.find_one({"_id": ObjectId(user_id)})
    user_name = data.get("userName")
    fase = data.get("fase")
    titulo = data.get("titulo")
    respuestas = data.get("respuestas")
    interviewer = data.get("entrevistador", {})

    fase_obj = {
        "fase": fase,
        "titulo": titulo,
        "respuestas": respuestas,
        "fecha": datetime.now(timezone.utc)
    }

    entrevista_existente = mongo.db.entrevistas.find_one({"user_id": ObjectId(user_id)})

    if entrevista_existente:
        mongo.db.entrevistas.update_one(
            {"user_id": ObjectId(user_id)},
            {"$push": {"phases": fase_obj}}
        )
    else:
        mongo.db.entrevistas.insert_one({
            "user_id": ObjectId(user_id),
            "user_name": user_name,
            "interviewer_id": interviewer.get("id"),
            "interviewer_name": interviewer.get("nombre"),
            "created_at": datetime.now(timezone.utc),
            "phases": [fase_obj],
            "comentarios_admin": "",
            "correo_enviado": False
        })

    return jsonify({"message": "Fase guardada correctamente"}), 200

@entrevistas_bp.route('/api/entrevista/fase', methods=['OPTIONS', 'POST'])
def placeholder_entrevista():
    if request.method == 'OPTIONS':
        return '', 200
    return jsonify({"message": "Endpoint /api/entrevista/fase está activo"}), 200

@entrevistas_bp.route('/api/entrevista/<user_id>/fase', methods=['GET'])
def obtener_fases_completadas(user_id):
    entrevista = mongo.db.entrevistas.find_one({"user_id": ObjectId(user_id)})
    fases = entrevista.get("phases", [])
    fases_nombres = [fase.get("fase") for fase in fases]

    return jsonify({
        "fases_completadas": len(fases),
        "fases": fases_nombres
    }), 200

@entrevistas_bp.route('/api/entrevista/fase', methods=['GET'])
def listar_entrevistas():
    entrevistas = []
    for ent in mongo.db.entrevistas.find():
        user_id = ent.get("user_id")
        user = mongo.db.users.find_one({"_id": ObjectId(user_id)}) if user_id else None  # ✅ conversión
        entrevistas.append({
            "_id": str(ent["_id"]),
            "user_name": ent.get("user_name"),
            "user_id": str(user_id),
            "user_email": user.get("correo") if user else "Sin correo",  # ✅ solo si se encuentra
            "interviewer_name": ent.get("interviewer_name"),
            "fase_titulos": [f.get("titulo") for f in ent.get("phases", [])],
            "correo_enviado": ent.get("correo_enviado", False),
            "created_at": ent.get("created_at").isoformat() if ent.get("created_at") else None
        })
    return jsonify(entrevistas), 200

@entrevistas_bp.route('/api/entrevista/<user_id>', methods=['DELETE'])
def eliminar_entrevista(user_id):
    result = mongo.db.entrevistas.delete_one({"user_id": ObjectId(user_id)})
    return jsonify({"message": "Entrevista eliminada"}), 200

@entrevistas_bp.route('/api/entrevista/<user_id>', methods=['GET'])
def detalle_entrevista(user_id):
    entrevista = mongo.db.entrevistas.find_one({"user_id": ObjectId(user_id)})
    entrevista["_id"] = str(entrevista["_id"])
    entrevista["user_id"] = str(entrevista["user_id"])
    entrevista["user_email"] = user.get("correo") if user else "Sin correo"
    return jsonify(entrevista), 200

@entrevistas_bp.route('/api/entrevista/<user_id>/comentario', methods=['POST'])
def enviar_comentario_admin(user_id):
    data = request.get_json()
    comentario = data.get("comentario")
    correo_destino = data.get("correo")
    nombre = data.get("nombre")

    mongo.db.entrevistas.update_one(
        {"user_id": ObjectId(user_id)},
        {"$set": {"comentarios_admin": comentario, "correo_enviado": True}}
    )

    send_email_to_candidate(correo_destino, nombre, comentario)

    return jsonify({"message": "Comentario enviado y guardado"}), 200

def send_email_to_candidate(correo, nombre, comentario):
    if not correo:
        raise ValueError("El correo del destinatario está vacío o no se proporcionó.")
    if not nombre:
        nombre = "Usuario"

    print(f"[DEBUG] Enviando correo a: {correo}")  # Puedes quitarlo después

    api_instance = sib_api_v3_sdk.TransactionalEmailsApi(sib_api_v3_sdk.ApiClient(configuration))
    contenido = f"""
        <p>Hola {nombre},</p>
        <p>Gracias por participar en el proceso de entrevistas.</p>
        <p><strong>Comentarios del reclutador:</strong></p>
        <p>{comentario}</p>
    """
    email = sib_api_v3_sdk.SendSmtpEmail(
        to=[{"email": correo}],  # 👈 asegúrate de que `correo` es string válido
        subject="Resultado de tu entrevista - JobQuest",
        html_content=contenido,
        sender={"name": "JobQuest", "email": "jobquest.g2@gmail.com"}
    )
    api_instance.send_transac_email(email)


@companies_bp.route('/api/companies', methods=['GET'])
def get_companies():
    companies = []
    for company in company_colection.find():
        company_id = company['_id']
        members = list(user_colection.find({"company_id": company_id}))
        for m in members:
            m['_id'] = str(m['_id'])
            m['image'] = m.get('image', 'ruta/por/defecto.jpg')
        company['_id'] = str(company_id)
        company['members'] = members
        companies.append(company)

    return jsonify(companies), 200

@companies_bp.route('/addcompany', methods=['POST'])
def add_company():
    data = request.get_json()
    required_fields = ["nombre", "direccion", "telefono", "correo"]
    empresa = {
        "nombre": data["nombre"],
        "direccion": data["direccion"],
        "telefono": data["telefono"],
        "correo": data["correo"],
        "estado": "activo",
        "fecha": datetime.now(timezone.utc)
    }

    result = company_colection.insert_one(empresa)
    return jsonify({"mensaje": "Empresa agregada correctamente", "id": str(result.inserted_id)}), 201

@companies_bp.route('/updatecompany/<company_id>', methods=['PUT'])
def update_company(company_id):
    data = request.get_json()
    allowed_fields = set(data.keys())  # permite actualizar todo lo que venga
    update_data = {k: v for k, v in data.items() if v is not None}

    result = company_colection.update_one(
        {"_id": ObjectId(company_id)},
        {"$set": update_data}
    )

    return jsonify({"message": "Empresa actualizada correctamente"}), 200

@companies_bp.route('/deletecompany/<company_id>', methods=['DELETE'])
def delete_company(company_id):
    result = company_colection.delete_one({"_id": ObjectId(company_id)})
    return jsonify({"message": "Empresa eliminada correctamente"}), 200

# Registrar Blueprints
app.register_blueprint(users_bp)
app.register_blueprint(companies_bp)
app.register_blueprint(entrevistas_bp)
app.register_blueprint(accesos_bp)
if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)
