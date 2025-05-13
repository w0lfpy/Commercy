// Requerimos express-validator para validar los datos que llegan al servidor y el manejador de errores
const { check } = require('express-validator');
const validateResults = require('../utils/handleValidator');

/*
    * Validamos los campos del comercio a crear
    * Parámetros: ciudad, actividad, titulo, resumen, textos, imagenes, reseñas
    * No todos los campos son obligatorios
*/
const validatorCreateItem = [
    check('ciudad').exists().notEmpty(),
    check('actividad').exists().notEmpty(),
    check('titulo').exists().notEmpty(),
    check('resumen').exists().notEmpty(),
    check('textos').optional().notEmpty().isArray(),
    check('imagenes').optional().notEmpty().isArray(),
    check('cifComercio').exists().notEmpty(),
    check('reseñas').optional().notEmpty().isArray(),
    (req, res, next) => validateResults(req, res, next),
];

/*
    * Validamos el campo id del comercio a obtener
    * Parámetros: id
*/
const validatorGetItem = [
    check('id').exists().notEmpty().isMongoId(),
    (req, res, next) => {
        return validateResults(req, res, next);
    },
];

/*
    * Validamos los campos del comercio a actualizar
    * Parámetros: ciudad, actividad, titulo, resumen, textos, imagenes, reseñas
    * Todos los campos son opcionales
*/
const validatorActualizarItem = [
    check('ciudad').optional(),
    check('actividad').optional(),
    check('titulo').optional(),
    check('resumen').optional(),
    check('textos').optional(),
    check('imagenes').optional(),
    (req, res, next) => {
        return validateResults(req, res, next);
    },
];

/*
    * Validamos el campo cifComercio del comercio a eliminar
    * Parámetros: id
*/
const validatorEliminarItem = [
    check('cif').exists().notEmpty(),
    (req, res, next) => {
        return validateResults(req, res, next);
    },
];

// Exportamos los Validators
module.exports = { validatorCreateItem, validatorGetItem, validatorActualizarItem, validatorEliminarItem };