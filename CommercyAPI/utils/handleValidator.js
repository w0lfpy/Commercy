// Requerimos el método validationResult de express-validator para validar los resultados de las validaciones
const { validationResult } = require("express-validator");

// Middleware para validar los resultados de las validaciones
/*
  * Middleware para validar los resultados de las validaciones
  * - Si hay errores, los envía en la respuesta
  * - Si no hay errores, pasa al siguiente middleware
  * @param {Object} req - Objeto de petición
  * @param {Object} res - Objeto de respuesta
  * @param {Function} next - Función de retorno
*/
const validateResults = (req, res, next) => {
  try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
      }
      next();
  } catch (err) {
      handleHttpError(res, "VALIDATION_ERROR", 500);
  }
};

module.exports = validateResults;