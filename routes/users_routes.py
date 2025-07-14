#CRUD DE USUARIOS
# Creando un nuevo usuario
@app.route('/adduser', methods=['POST'])
def add_user():
    try:
        # Data es la informacion recibida del frontend en formato JSON

        print("-0-")
        data = request.get_json()
        if not data:
            return jsonify({"error": "No se recibió JSON válido"}), 400

        print("-1-")
        
        # se crea un objeto para validar la data
        required = ["code", "nameUser", "lastName", "phone", "birthDate", "gender", "dpi", "rol", "email", "password","laboralDate","educationData", "status","creationDate", "modificationDate"]
        print("-2-")
        # Se valida que la data contenga todos los campos requeridos
        if not all(k in data for k in required):
            return jsonify({"error": "Faltan campos requeridos"}), 400
        print("-3-")
        # Validacion para ver si existe o no
        user_exist = user_colection.find_one({"dpi": data["dpi"]})
        if user_exist:
            return jsonify({"error": "El usuario ya existe"}), 400
        print("-4-")
        # El usuario que viene en la data, viene completo y no existe en nuestra coleccion
        result = user_colection.insert_one(data)
        return jsonify({"mensaje": "Usuario agregado", "dpi": str(data["dpi"])}), 201
    except errors.PyMongoError as e:
        return jsonify({"error": str(e)}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Leer un usuario (Mostrar un usuario)
@app.route('/showuser/<string:dpi>', methods=['GET'])
def show_user(dpi):
    if db is None:
        return jsonify({"error": "No existe conexion a Mongo"}), 500
    usuario = user_colection.find_one({"dpi": dpi})
    if not usuario:
        return jsonify({"error": "Usuario no encontrado"}), 404
    
    return jsonify(user_to_dict(usuario)), 200

# Eliminar un usuario
@app.route('/deleteuser/<string:dpi>', methods=['DELETE'])
def delete_user(dpi):
    try:
        user = user_colection.find_one({"dpi": dpi})
        
        if not user:
            return jsonify({"error": "Usuario no encontrado"}), 404
        result = user_colection.delete_one({"dpi": dpi})
        
        if result.deleted_count == 1:
            return jsonify({"mensaje": "Usuario eliminado"}), 200
        else:
            return jsonify({"error": "No se pudo eliminar el usuario"}), 500
    except errors.PyMongoError as e:
        return jsonify({"error": str(e)}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Actualizar un usuario
@app.route('/updateuser/<string:dpi>', methods=['PUT'])
def update_user(dpi):
    try:
        # Los Datoss recibimos en formato JSON
        data = request.json
        #Verificamos que la data no este vacia
        # y que contenga al menos un campo para actualizar
        if not data:
            return jsonify({"error": "No se recibieron datos para actualizar"}), 400
        
        # Verificamos que el dpi ya existe en la coleccion
        user = user_colection.find_one({"dpi":dpi})
        if not user:
            return jsonify({"error": "Usuario no encontrado"}), 404
        
        # Si el usuario existe, actualizamos los campos que se enviaron en la data
        result = user_colection.update_one({"dpi": dpi}, {"$set": data})
        
        if result.modified_count == 1:
            return jsonify({"mensaje": "Usuario actualizado"}), 200 
        else:
            return jsonify({"error": "No se pudo actualizar el usuario"}), 500
    except errors.PyMongoError as e:
        return jsonify({"error": str(e)}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500
if __name__ == '__main__':
    app.run(debug=True)