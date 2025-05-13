const { handleHttpError } = require("../utils/handleErrors");
const { verifyToken } = require("../utils/handleJwt");
const usersModel = require("../models/users");
const comercioModel = require("../models/comercio");

/**
 * Middleware para comprobar la autenticación de los usuarios
  token: token recibido en la cabecera de la petición
  dataToken: variable que almacena los datos del token
  user: variable que almacena el usuario que corresponde al token
  Si no hay token, devuelvo un mensaje de error y un estado 401
  Si no hay id en el token, devuelvo un mensaje de error y un estado 401
  Si no existe el usuario, devuelvo un mensaje de error y un estado 404
  Si todo va bien, paso al siguiente middleware
  * @param {Object} req - Petición
  * @param {Object} res - Respuesta
  * @param {Function} next - Siguiente middleware
  * @returns {Function} - Función middleware
  * @throws {Function} - Función para manejar errores
*/
const authMiddleware = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      handleHttpError(res, "NOT_TOKEN", 401);

      return;
    }
    
    const token = req.headers.authorization.split(" ").pop();

    const dataToken = await verifyToken(token);

    if (!dataToken._id) {
      handleHttpError(res, "ERROR_ID_TOKEN", 401);
      return;
    }
    const user = await usersModel.findById(dataToken._id)
    if (!user) {
        return handleHttpError(res, "USER_NOT_FOUND", 404);
    }
    
    req.user = user
    next();
  } catch (err) {
    handleHttpError(res, "NOT_SESSION", 401);
  }
};

/*
  * Middleware para comprobar la autenticación de los comercios
  token: token recibido en la cabecera de la petición
  dataToken: variable que almacena los datos del token
  comercio: variable que almacena el comercio que corresponde al token
  Si no hay token, devuelvo un mensaje de error y un estado 401
  Si no hay id en el token, devuelvo un mensaje de error y un estado 401
  Si no existe el comercio, devuelvo un mensaje de error y un estado 404
  Si todo va bien, paso al siguiente middleware
  * @param {Object} req - Petición
  * @param {Object} res - Respuesta
  * @param {Function} next - Siguiente middleware
  * @returns {Function} - Función middleware
  * @throws {Function} - Función para manejar errores
*/
const comercioMiddleware = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      handleHttpError(res, "NOT_TOKEN", 401);

      return;
    }
    
    const token = req.headers.authorization.split(" ").pop();

    const dataToken = await verifyToken(token);

    if (!dataToken._id) {
      handleHttpError(res, "ERROR_ID_TOKEN", 401);
      return;
    }
    const comercio = await comercioModel.findOne({ cif: dataToken.cif })
    if (!comercio) {
        return handleHttpError(res, "COMERCIO_NOT_FOUND", 404);
    }
    
    req.comercio = comercio
    next();
  } catch (err) {
    handleHttpError(res, "NOT_SESSION", 401);
  }
};

module.exports = {authMiddleware, comercioMiddleware};
