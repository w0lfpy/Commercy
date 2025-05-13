// Importacion de mongoose
const mongoose = require('mongoose')

// Creación del esquema de comercio
const ComercioSchema = new mongoose.Schema(
    {
        nombre: {
            type: String
        },
        cif: {
            type: String,
            unique: true
        },
        direccion: {
            type: String
        },
        email: {
            type: String,
            unique: true
        },
        telefono: {
            type: String
        },
        id: {
            type: Number
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
)

// Creación del modelo de comercio
const comercioModel = mongoose.model('Comercio', ComercioSchema)

// Exportación del modelo de comercio
module.exports = comercioModel