const mongoose = require('mongoose')
const mongooseDelete = require("mongoose-delete")

// Creación del esquema de Auth
const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String
        },
        age: {
            type: Number
        },
        email: {
            type: String,
            unique: true
        },
        password: {
            type: String
        },
        ciudad: {
            type: String
        },
        intereses: {
            type: [String],
            default: []
        },
        ofertas: {
            type: Boolean
        },
        role: {
            type: ["user", "admin"],
            default: "user"
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
)

UserSchema.plugin(mongooseDelete, {overrideMethods: "all"})

const UserModel = mongoose.model('User', UserSchema)
module.exports = UserModel  