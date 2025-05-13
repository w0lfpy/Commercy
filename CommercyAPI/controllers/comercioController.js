// Importación de los modelos necesarios
const { default: mongoose } = require("mongoose");
const comercioModel = require("../models/comercio");
const { matchedData } = require('express-validator');
const { tokenSignComercio } = require('../utils/handleJwt');
const { handleHttpError } = require('../utils/handleErrors');
const { encrypt } = require("../utils/handlePassword");

// Funciones del controlador
/*
    Función para obtener todos los items de la base de datos de comercios
    req.query.ordenar: parámetro opcional para ordenar los comercios por cif
    ordenarOpcion: objeto que paso a la función sort de mongoose para ordenar los comercios
    De acuerdo al valor de ordenar, ordenarOpcion será un objeto vacío, {cif: 1} o {cif: -1}
    data: variable que almacena los comercios ordenados
    Si hay un error, devuelvo un mensaje de error y un estado 500
    Si todo va bien, devuelvo los comercios y un estado 200
*/
const getItems = async (req, res) => {
    try {
        const ordenar = req.query.ordenar;
        let ordenarOpcion = {};
        if (ordenar === "desc") {
            ordenarOpcion = {cif: -1};
        } else if (ordenar === "asc") {
            ordenarOpcion = {cif: 1};
        }
        const data = await comercioModel.find().sort(ordenarOpcion);
        res.status(200).json(data);
    } catch (error) {
        handleHttpError(error, res);
    }
}

/*
    Función para obtener un item de la base de datos de comercios
    req.params.cif: parámetro por el que recibimos el cif del comercio a buscar
    comercio: variable que almacena el comercio encontrado
    Si no se encuentra el comercio, devuelvo un mensaje de error y un estado 404
    Si hay un error, devuelvo un mensaje de error y un estado 500
    Si todo va bien, devuelvo el comercio y un estado 200
*/
const getItem = async (req, res) => {
    try {
        const { cif } = matchedData(req)
        const lowerCaseCif = cif.toLowerCase();
        const data = await comercioModel.findOne({ cif: lowerCaseCif });
        res.status(200).json(data);
    } catch (error) {
        handleHttpError(error, res);
    }
}

/*
    Función para crear un item en la base de datos de comercios
    req.body: cuerpo de la petición con los datos del comercio a crear
    data: variable que almacena el comercio creado
    Si hay un error, devuelvo un mensaje de error y un estado 500
    Si todo va bien, devuelvo el comercio creado y un estado 201
*/
const createItem = async (req, res) => {
    try {
        const body = matchedData(req);

        // Convertir CIF a minúsculas
        body.cif = body.cif.toLowerCase();

        // Verifica si el CIF ya existe
        const comercio = await comercioModel.findOne({ cif: body.cif });
        if (comercio) {
            return res.status(400).json({ error: "CIF already exists" });
        }

        // Crea el comercio
        const dataComercio = await comercioModel.create(body);
        const token = await tokenSignComercio(dataComercio);

        res.status(200).json({
            token,
            comercio: dataComercio,
        });
    } catch (error) {
        handleHttpError(res, error.message || "Error creating item", 500);
    }
};

/*
    Función para actualizar un comercio en la base de datos de comercios
    req.params.id: parámetro por el que recibimos el id del comercio a actualizar
    req.params.cif: parámetro por el que recibimos el cif del comercio a actualizar
    body: variable que almacena los datos del comercio a actualizar
    data: variable que almacena el comercio actualizado
    Si el id no es un ObjectId válido, devuelvo un mensaje de error y un estado 400
    Si no se proporciona el cif, devuelvo un mensaje de error y un estado 400
    Si no se encuentra el comercio, devuelvo un mensaje de error y un estado 404
    Si hay un error, devuelvo un mensaje de error y un estado 500
    Si todo va bien, devuelvo el comercio actualizado y un estado 200
*/
const updateItem = async (req, res) => {
    try {
        const { id, cif } = matchedData(req); 
        const body = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send("Invalid ID format. Must be a valid 24-character ObjectId.");
        }

        if (!cif) {
            return res.status(400).send("CIF is required");
        }

        // Convertir CIF a minúsculas
        const lowerCaseCif = cif.toLowerCase();
        body.cif = body.cif?.toLowerCase(); // Si el CIF se actualiza, convertirlo

        const data = await comercioModel.findOneAndUpdate(
            { _id: id, cif: lowerCaseCif },  
            body,                   
            { new: true }            
        );

        if (!data) {
            return res.status(404).send("Comercio not found");
        }

        res.status(200).json(data);
    } catch (error) {
        handleHttpError(res, error.message || "Error updating item", 500);
    }
};

/*
    Función para eliminar un comercio en la base de datos de comercios
    req.params.cif: parámetro por el que recibimos el cif del comercio a eliminar
    data: variable que almacena el comercio eliminado
    Si hay un error, devuelvo un mensaje de error y un estado 500
    Si todo va bien, devuelvo el comercio eliminado y un estado 204
*/
const deleteItem = async (req, res) => {
    try {
        const { cif } = matchedData(req);
        const lowerCaseCif = cif.toLowerCase();
        const data = await comercioModel.findOneAndDelete({ cif: lowerCaseCif });
        res.status(200).json("Comercio eliminado correctamente");
    } catch (error) {
        handleHttpError(error, res);
    }
}

// Exporto las funciones del controlador
module.exports = { getItems, getItem, createItem, updateItem, deleteItem };