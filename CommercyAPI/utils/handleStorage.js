// Creación de un middleware para subir archivos
// Requerimos los módulos necesarios
const multer = require("multer");
const fs = require('fs');
const path = require('path');

// Verifica que la carpeta uploads exista o créala
const pathStorage = path.join(__dirname, '/../uploads');
if (!fs.existsSync(pathStorage)) {
    fs.mkdirSync(pathStorage, { recursive: true });
}

/*
  * Configuración de multer
  * - destination: ruta donde se guardarán los archivos
  * - filename: nombre del archivo
  * @param {Object} req - Objeto de petición
  * @param {Object} file - Archivo a subir
  * @param {Function} callback - Función de retorno
*/
const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, pathStorage); 
  },

  filename: function (req, file, callback) {
    const ext = file.originalname.split(".").pop(); 
    const filename = "file-" + Date.now() + "." + ext;
    callback(null, filename);
  },
});

// Middleware para subir archivos
const uploadMiddleware = multer({ storage }); //Middleware entre la ruta y el controlador

// Exportamos el middleware
module.exports = uploadMiddleware;