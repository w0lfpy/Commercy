// Importa el módulo de mongoose y mongoose-delete
const mongoose = require('mongoose')
const mongooseDelete = require('mongoose-delete')

// Creación del esquema de la web
const WebSchema = new mongoose.Schema(
    {
        ciudad: {
            type: String
        },
        actividad: {
            type: String
        },
        titulo: {
            type: String
        },
        resumen: {
            type: String
        },
        textos: {
            type: [String]
        },
        imagenes: {
            type: [String]
        },
        cifComercio: {
            type: String
        },
        reseñas: [
            {
                scoring: {
                    type: Number,
                    min: 0,
                    max: 5
                },
                puntuacion: {
                    type: Number
                },
                texto: {
                    type: String
                }
            }
        ]
    }
)

// Añado el plugin de mongoose-delete al esquema de la web
WebSchema.plugin(mongooseDelete, {overrideMethods: "all"})
// Creación del modelo de web
const webModel = mongoose.model('Web', WebSchema)

// Exportación del modelo de web
module.exports = webModel