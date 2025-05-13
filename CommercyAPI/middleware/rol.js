const { handleHttpError } = require("../utils/handleErrors");

/**
 * Middleware para comprobar los roles de los usuarios
 * @param {Array} roles - Roles permitidos
 * @returns {Function} - Función middleware
 * @throws {Function} - Función para manejar errores
*/
const checkRol = (roles) => (req, res, next) => {
  // Doble argumento de función para poder pasarle los roles
  try {
    const { user } = req;
    const userRol = user.role;
    const checkValueRol = roles.includes(userRol); 
    if (!checkValueRol) {
      handleHttpError(res, "NOT_ALLOWED", 403);

      return;
    }
    next();
  } catch (err) {
    handleHttpError(res, "ERROR_PERMISSIONS", 403);
  }
};

module.exports = { checkRol };
