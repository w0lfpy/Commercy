const { check } = require("express-validator")
const validateResults = require("../utils/handleValidator")

/*
    * Validadores para el registro de usuarios
    * Requiere que el nombre, la edad, el email, la contraseña, la ciudad, las ofertas y el rol estén presentes
*/
const validatorRegister = [
    check("name").exists().notEmpty().isLength( {min:3, max: 99} ),
    check("age").exists().notEmpty().isNumeric(), 
    check("email").exists().notEmpty().isEmail(),
    check("password").exists().notEmpty().isLength( {min:8, max: 16} ),
    check("ciudad").exists().notEmpty(),
    check("intereses").optional().isArray(),
    check("ofertas").exists().notEmpty().isBoolean(),
    check("role").optional().notEmpty().isIn(["user", "admin"]),
    (req, res, next) => {
        return validateResults(req, res, next)
    }
]

/*
    * Validadores para el login de usuarios
    * Requiere que el email y la contraseña estén presentes
*/
const validatorLogin = [
    check("email").exists().notEmpty().isEmail(),
    check("password").exists().notEmpty().isLength( {min:8, max: 16} ),
    (req, res, next) => {
        return validateResults(req, res, next)
    }
]

/*
    * Validadores para la actualización de usuarios
    * Permite actualizar el nombre, la edad, el email, la ciudad, los intereses y las ofertas
*/
const validatorUpdate = [
    check("name").optional().isLength( {min:3, max: 99} ),
    check("age").optional().isNumeric(), 
    check("email").optional().isEmail(),
    check("ciudad").optional(),
    check("intereses").optional().isArray(),
    check("ofertas").optional().isBoolean(),
    (req, res, next) => {
        return validateResults(req, res, next)
    }
]

const validatorReviewWeb = [
    check("scoring").exists().notEmpty().isNumeric().isInt({min: 0, max: 5}),
    check("puntuacion").exists().notEmpty().isNumeric(),
    check("texto").exists().notEmpty().isString(),
]

module.exports = { validatorRegister, validatorLogin, validatorUpdate, validatorReviewWeb }