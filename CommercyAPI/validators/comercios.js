// Requerimos express-validator para validar los campos de los comercios y el manejador de errores
const { check } = require('express-validator');
const validateResults = require('../utils/handleValidator');

/*
    * Validamos los campos del comercio a crear
    * Parámetros: nombre, cif, direccion, email, telefono, id
    * Todos los campos son obligatorios
*/
const validatorCreateItem = [
    check('nombre').exists().notEmpty(),
    check('cif').exists().notEmpty(),
    check('direccion').exists().notEmpty(),
    check('email').exists().notEmpty(),
    check('telefono').exists().notEmpty(),
    check('id').exists().notEmpty(),
    (req, res, next) => validateResults(req, res, next),
];

/*
    * Validamos el campo cif del comercio a obtener
    * Parámetros: cif
*/
const validatorGetItem = [
    check('cif').exists().notEmpty().isString(),
    (req, res, next) => {
        return validateResults(req, res, next);
    },
];

/*
    * Validamos los campos del comercio a actualizar
    * Parámetros: nombre, cif, direccion, email, telefono, id
    * Todos los campos son opcionales
    * Se valida que al menos uno de los campos sea enviado
    * Se valida que los campos sean de tipo string
*/
const validatorActualizarItem = [
    check('nombre').optional().notEmpty(),
    check('cif').optional().notEmpty(),
    check('direccion').optional().notEmpty(),
    check('email').optional().notEmpty(),
    check('telefono').optional().notEmpty(),
    check('id').optional().notEmpty(),
    (req, res, next) => {
        return validateResults(req, res, next);
    },
];

/*
    * Validamos el campo cif del comercio a eliminar
    * Parámetros: cif
*/
const validatorEliminarItem = [
    check('cif').exists().notEmpty().isString(),
    (req, res, next) => {
        return validateResults(req, res, next);
    },
];

// Exportamos los Validators
module.exports = { validatorCreateItem, validatorGetItem, validatorActualizarItem, validatorEliminarItem };

