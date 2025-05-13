// Importo el modelo de web 
const webModel = require('../models/web')
const userModel = require('../models/users')
const { matchedData } = require('express-validator')
const { handleHttpError } = require('../utils/handleErrors');

/*
    Función para subir un archivo a la base de datos
    req.file: archivo que se sube a la base de datos
    imageUrl: ruta de la imagen en la base de datos
    page: variable que almacena la página a la que se le añade la imagen
    Si no se sube ningún archivo, devuelvo un mensaje de error y un estado 400
    Si no se encuentra la página, devuelvo un mensaje de error y un estado 404
    Si hay un error, devuelvo un mensaje de error y un estado 500
    Si todo va bien, devuelvo la página y un estado 200
*/
const createFile = async (req, res) => {
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
    let { texts } = req.body;

    try {
        if (texts && typeof texts === 'string') {
            texts = texts.split(',').map(text => text.trim());
        }
        const updateData = {}
        if (imageUrl) {
            updateData.$push = { imagenes: imageUrl };
        }
        if (texts && texts.length > 0) {
            updateData.$push = {
                ...updateData.$push,
                textos: { $each: texts }
            };
        }
        const { cif } = req.params;
        if (!cif) {
            return res.status(400).json({ message: "CIF no proporcionado en la solicitud." });
        }
        const cifComercio = cif.toLowerCase();
        const page = await webModel.findOneAndUpdate(
            { cifComercio },
            updateData,
            { new: true }
        );
        if (!page) {
            return res.status(404).json({ message: 'Página no encontrada' });
        }
        res.json(page);
    } catch (error) {
        handleHttpError(res, 500, error.message);
    }
};

/*
    Función para obtener los items de la base de datos
    body: variable que almacena los datos de los items a buscar
    data: variable que almacena los items encontrados
    Si hay un error, devuelvo un mensaje de error y un estado 500
    Si todo va bien, devuelvo los items y un estado 200
*/
const getItems = async (req, res) => {
    try {
        const body = matchedData(req);
        const data = await webModel.find(body);
        res.status(200).json(data);
    } catch (error) {
        handleHttpError(error, res);
    }
}

/*
    Función para obtener un item de la base de datos
    req.params.id: parámetro por el que recibimos el id del item a buscar
    data: variable que almacena el item encontrado
    Si no se encuentra el item, devuelvo un mensaje de error y un estado 404
    Si hay un error, devuelvo un mensaje de error y un estado 500
    Si todo va bien, devuelvo el item y un estado 200
*/
const getItem = async (req, res) => {
    try {
        const { id } = matchedData(req)
        const data = await webModel.findById(id)
        res.status(200).json(data);
    } catch (error) {
        handleHttpError(error, res);
    }
}

/*
    Función para obtener los emails de usuarios interesados en una web
    req.params.cif: parámetro por el que recibimos el cif de la web
    existeWeb: variable que almacena la web a la que se le buscan los interesados
    webActividad: variable que almacena la actividad de la web
    users: variable que almacena los usuarios interesados en la web
    Si no se encuentra la web, devuelvo un mensaje de error y un estado 404
    Si hay un error, devuelvo un mensaje de error y un estado 500
    Si todo va bien, devuelvo los usuarios y un estado 200
*/
const getInterestWeb = async (req, res) => {
    try {
        const cifToken = req.comercio?.cif;
        if (!cifToken) {
            return res.status(400).json({ message: "CIF del token no proporcionado." });
        }
        const { cif } = req.params;
        const cifComercio = cif.toLowerCase();
        if (!cif) {
            return res.status(400).json({ message: "CIF no proporcionado en la solicitud." });
        }

        const existeWeb = await webModel.findOne({ cifComercio });
        if (!existeWeb) {
            return res.status(404).json({ message: "No existe una web creada para este CIF." });
        }

        if (cifComercio !== existeWeb.cifComercio) {
            return res.status(401).send("No tienes permiso para ver los interesados de esta página.");
        }

        const webActividad = existeWeb.actividad;
        const users = await userModel.find({ intereses: webActividad, ofertas: true });
        res.status(200).json(users.map(user => user.email));

    } catch (error) {
        handleHttpError(error, res);
    }
}

/*
    Función para crear un item en la base de datos
    req.body: cuerpo de la petición con los datos del item a crear
    data: variable que almacena el item creado
    Si hay un error, devuelvo un mensaje de error y un estado 500
    Si todo va bien, devuelvo el item creado y un estado 201
*/
const createItem = async (req, res) => {
    try {
        const body = matchedData(req);
        const data = await webModel.create(body);
        res.send(data)
    } catch (error) {
        handleHttpError(error, res);
    }
}

const createWebPage = async (req, res) => {
    try {
        const cifToken = req.comercio.cif;
        const body = matchedData(req);
        body.cifComercio = body.cifComercio.toLowerCase();
        const cifComercio = body.cifComercio;
        console.log(cifToken, cifComercio);

        if (String(cifToken) !== String(cifComercio)) {
            return res.status(401).send("No tienes permiso para crear esta página");
        }

        const cifCommerceFull = cifComercio.toLowerCase();
        const existeWeb = await webModel.findOne({ cifComercio: cifCommerceFull });
        if (existeWeb) {
            return res.status(400).json({ message: "Ya existe una web creada para este CIF." });
        }

        const lowerCaseBody = {};
        for (let key in body) {
            if (typeof body[key] === 'string') {
                lowerCaseBody[key] = body[key].toLowerCase();
            } else {
                lowerCaseBody[key] = body[key];
            }
        }

        const dataWeb = await webModel.create(lowerCaseBody);
        res.status(200).json(dataWeb);
    } catch (error) {
        handleHttpError(error, res);
    }
}

/*
    Función para actualizar un item en la base de datos
    req.params.cif: parámetro por el que recibimos el cif del item a actualizar
    req.body: cuerpo de la petición con los datos del item a actualizar
    data: variable que almacena el item actualizado
    Si no se encuentra el item, devuelvo un mensaje de error y un estado 404
    Si hay un error, devuelvo un mensaje de error y un estado 500
    Si todo va bien, devuelvo el item actualizado y un estado 200
*/
const updateItem = async (req, res) => {
    try {
        const cifToken = req.comercio?.cif; // Obtenemos el CIF del token
        if (!cifToken) {
            return res.status(400).json({ message: "CIF del token no proporcionado." });
        }

        const { cif } = req.params;
        const cifComercio = cif.toLowerCase();
        if (!cif) {
            return res.status(400).json({ message: "CIF no proporcionado en la solicitud." });
        }

        const body = matchedData(req);
        if (!body) {
            return res.status(400).json({ message: "El cuerpo de la solicitud no es válido." });
        }

        const existeWeb = await webModel.findOne({ cifComercio: cifComercio });
        console.log(cifComercio, cifToken, body);
        if (!existeWeb) {
            return res.status(404).json({ message: "No existe una web creada para este CIF." });
        }

        if (cifComercio !== req.comercio.cif) {
            return res.status(401).send("No tienes permiso para editar esta página.");
        }

        const data = await webModel.findOneAndUpdate(
            { cifComercio: cifComercio },
            body,
            { new: true, runValidators: true }
        );

        if (!data) {
            return res.status(404).json({ message: "No se pudo actualizar la web. Intenta nuevamente." });
        }

        res.status(200).json(data);
    } catch (error) {
        console.error("Error en updateItem:", error);
        res.status(500).send("Error al procesar la solicitud");
    }
};

/*
    Función para eliminar un item de la base de datos
    req.params.cif: parámetro por el que recibimos el cif del item a eliminar
    softDelete: variable que almacena si se elimina de forma suave o no
    data: variable que almacena el item eliminado
    Si no se encuentra el item, devuelvo un mensaje de error y un estado 404
    Si hay un error, devuelvo un mensaje de error y un estado 500
    Si todo va bien, devuelvo el item eliminado y un estado 200
*/
const deleteItem = async (req, res) => {
    try {
        const cifToken = req.comercio.cif;
        if (!cifToken) {
            return res.status(400).json({ message: "CIF del token no proporcionado." });
        }

        const { cif } = req.params;
        const cifComercio = cif.toLowerCase();
        if (!cif) {
            return res.status(400).json({ message: "CIF no proporcionado en la solicitud." });
        }

        const existeWeb = await webModel.findOne({ cifComercio });
        if (!existeWeb) {
            return res.status(404).json({ message: "No existe una web creada para este CIF." });
        }

        if (cifComercio !== req.comercio.cif) {
            return res.status(401).send("No tienes permiso para eliminar esta página.");
        }

        const softDelete = req.query.soft === "True";
        let data;

        if (softDelete) {
            data = await webModel.delete({ cifComercio });
        } else {
            data = await webModel.findOneAndDelete({ cifComercio });
        }

        if (!data) {
            return res.status(404).send("Web no encontrada");
        }

        const message = softDelete ? "Web archivada" : "Web eliminada";
        res.status(200).json(message);
    } catch (error) {
        handleHttpError(error, res);
    }
};

/*
    Función para restaurar una web de la base de datos
    req.params.cif: parámetro por el que recibimos el cif de la web a restaurar
    data: variable que almacena la web restaurada
    updatedData: variable que almacena la web actualizada
    message: mensaje de éxito
    Si no se encuentra la web, devuelvo un mensaje de error y un estado 401
    Si hay un error, devuelvo un mensaje de error y un estado 500
    Si todo va bien, devuelvo el mensaje de éxito y un estado 200
*/
const restoreWeb = async (req, res) => {
    try {
        const cifToken = req.comercio.cif;
        const { cif } = req.params;
        const cifCommercioLower = cif.toLowerCase();
        const busqueda = await webModel.findOne({ cifComercio: cifCommercioLower });
        if (busqueda) {
            return res.status(404).json({ message: "Ya existe una web para este comercio" });
        }
        const cifTokenFull = cifToken.toLowerCase();
        if (cifTokenFull !== cifCommercioLower) {
            return res.status(401).send("No tienes permiso para restaurar esta página");
        }
        const data = await webModel.restore({ cifComercio: cifCommercioLower });
        const updatedData = await webModel.findOneAndUpdate(
            { cifComercio: cifCommercioLower },
            { delete: false },
            { new: true }
        );
        const message = { mensaje: "Web del comercio restaurada", data: updatedData };
        res.status(200).json(message);
    } catch (error) {
        handleHttpError(error, res);
    }
}

// Exporto las funciones para poder usarlas en otros archivos
module.exports = { createWebPage, createFile, getItems, getItem, getInterestWeb, createItem, updateItem, deleteItem, restoreWeb };