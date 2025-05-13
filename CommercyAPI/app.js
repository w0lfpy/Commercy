// Importo express y la conexión a la base de datos
require('dotenv').config();
const express = require('express');
const dbConnect = require('./config/mongo.js');
const cors = require('cors');
const morganBody = require('morgan-body');
const loggerStream = require('./utils/handleLogger.js');
const swaggerUi = require("swagger-ui-express")
const swaggerSpecs = require('./docs/swagger');

// Inicializo la aplicación de express y la conexión a la base de datos
dbConnect();
const app = express();

// Configuro la aplicación para que pueda enviar mensajes a Slack
morganBody(app, {
    noColors: true, //limpiamos el String de datos lo máximo posible antes de mandarlo a Slack
  
    skip: function (req, res) {
      //Solo enviamos errores (4XX de cliente y 5XX de servidor)
      return res.statusCode < 400;
    },
  
    stream: loggerStream(process.env.SLACK_WEBHOOK),
});

app.use(cors());
// Configuro la aplicación para que pueda recibir datos en formato JSON
app.use(express.json());
app.use("/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpecs)
)

// Configuro la aplicación para que pueda servir archivos estáticos
app.use('/uploads', express.static("uploads")) 

// Importo las rutas y las uso
app.use("/api/comercios", require("./routes/comercioRoutes.js"))
app.use("/api/web", require("./routes/webRoutes.js"))
app.use("/api/user", require("./routes/authRoutes.js"))

// Inicializo el servidor en el puerto 3000
const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log("Servidor escuchando en el puerto " + port)
})

// Exporto la aplicación para poder testearla
module.exports = app;