const { matchedData }  = require('express-validator');
const { tokenSign } = require('../utils/handleJwt');
const { encrypt, compare } = require('../utils/handlePassword');
const { handleHttpError } = require('../utils/handleErrors');
const usersModel = require('../models/users');
const webModel = require('../models/web');

/*
    Función que permite registrar un usuario en la base de datos
    @param req: objeto de tipo Request
    @param res: objeto de tipo Response
    @returns Promise<void>
*/
const registerCntrl = async (req, res) => {
    req = matchedData(req);
    const password = await encrypt(req.password);
    const body = { ...req, password }; 
    const dataUser = await usersModel.create(body);
    dataUser.set("password", undefined, { strict: false });

    const data = {
        token: await tokenSign(dataUser),
        user: dataUser,
    };

    res.send(dataUser);
}

/*
    Función que permite loguear un usuario en la base de datos
    @param req: objeto de tipo Request
    @param res: objeto de tipo Response
    @returns Promise<void>
*/
const loginCntrl = async (req, res) => {
    req = matchedData(req);
    const dataUser = await usersModel.findOne({ email: req.email });
    if (!dataUser) {
        return res.status(401).send("Usuario no encontrado");
    }
    const isPasswordOk = await compare(req.password, dataUser.password);
    if (!isPasswordOk) {
        return res.status(401).send("Contraseña incorrecta");
    }
    dataUser.set("password", undefined, { strict: false });
    const data = {
        token: await tokenSign(dataUser),
        user: dataUser,
    };
    res.send(data);
}

/*
    Función que permite actualizar un usuario en la base de datos
    @param req: objeto de tipo Request
    @param res: objeto de tipo Response
    @returns Promise<void>
*/
const updateCntrl = async (req, res) => {
    try {
        const { id } = req.params; // Extrae el id del request
        const body  = matchedData(req); // Extrae el id y el resto de los datos

        // Asegurarme que el rol no pueda ser actualizado
        delete body.role;

        const data = await usersModel.findByIdAndUpdate(id, body, { new: true });
        data.set("password", undefined, { strict: false }); 

        res.status(200).json(data);
    } catch (error) {
        handleHttpError(error, res);
    }
}

/*
    Función que permite eliminar un usuario en la base de datos
    @param req: objeto de tipo Request
    @param res: objeto de tipo Response
    @returns Promise<void>
*/
const deleteCntrl = async (req, res) => {
    try {
        const { id } = req.params; 
        const userId = req.user._id.toString();
        // Verifico que el usuario solo pueda eliminarse a sí mismo
        if (id !== userId) {
            return res.status(403).send("No puedes eliminar a otros usuarios");
        }
        const data = await usersModel.findByIdAndDelete(id);
        const message = data ? "Usuario eliminado exitosamente" : "Usuario no encontrado";
        res.status(200).json(message);
    } catch (error) {
        handleHttpError(error, res);
    }
}

const getComerciosFilter = async (req, res) => {
    try {
        const { ciudad } = req.params;
        const { intereses, ordenarScoring } = req.query;
        const filter = { ciudad };
        if (intereses) {
            filter.actividad = intereses;
        }
        let data = await webModel.find(filter);
        if (ordenarScoring) {
            data = data.sort((a, b) => b.reseñas.scoring - a.reseñas.scoring);
        }
        res.status(200).json(data);
    } catch (error) {
        handleHttpError(error, res);
    }
}

const postReviewWeb = async (req, res) => {
    try {
        const { id } = req.params;
        const body = matchedData(req);
        const data = await webModel.findOne({ _id: id });
        data.reseñas.push(body);
        await data.save();
        res.status(200).json(data);
    } catch (error) {
        handleHttpError(error, res);
    }
}

module.exports = { registerCntrl, loginCntrl, updateCntrl, deleteCntrl, getComerciosFilter, postReviewWeb }