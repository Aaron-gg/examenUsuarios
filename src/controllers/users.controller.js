'use strict';

const User = require('../models/users.model');
const jwt = require('jsonwebtoken');
const { secretKey } = require('../config/keys');

const controller = {
    registro: async (req, res) => {
        const {
            nombre,
            apellidoPaterno,
            apellidoMaterno,
            numeroTelefonico,
            correo,
            nombreUsuario,
            password
        } = req.body;

        const sameNombreUsuario = await User.findOne({ nombreUsuario: nombreUsuario });
        if( sameNombreUsuario ) return res.status(400).json({ message: "Nombre de usuario ya existe"});
        
        await new User({
            nombre,
            apellidoPaterno,
            apellidoMaterno,
            numeroTelefonico,
            correo,
            nombreUsuario,
            password: await User.encryptPassword(password),
        }).save();

        res.status(201).json({ message: "Usuario creado" });
    },
    logIn: async (req, res) => {
        let user = "";
        
        const foundNombreUsuario = await User.findOne({ nombreUsuario: req.body.nombreUsuario });
        const foundTelefono = await User.findOne({ numeroTelefonico: req.body.numeroTelefonico });
        if(foundNombreUsuario === null && foundTelefono === null) return res.status(401).send("Usuario no encontrado");
        
        if(foundNombreUsuario){
            user = foundNombreUsuario;
            const matchPassword = await User.comparePassword(req.body.password, foundNombreUsuario.password);
            if(!matchPassword) return res.status(403).send("Contraseña invalida");
        }
        if(foundTelefono){
            user = foundTelefono;
            const matchPassword = await User.comparePassword(req.body.password, foundTelefono.password);
            if(!matchPassword) return res.status(403).send("Contraseña invalida");
        }       

        const token = jwt.sign({id: user._id}, secretKey, {
            expiresIn: '6h'
        });

        res.status(200).json({
            nombre: user.nombre,
            apellidoPaterno: user.apellidoPaterno,
            apellidoMaterno: user.apellidoMaterno,
            numeroTelefonico: user.numeroTelefonico,
            correo: user.correo,
            nombreUsuario: user.nombreUsuario,
            token: token
        });
    },
    consulta: async (req, res) => {
        const allUsers = await User.find();
        res.json({ allUsers });
    },
    logOut: async (req, res) => {
        const ExpiredToken = req.headers["x-token"];
        await User.findOneAndUpdate( { _id: req.userId }, { $push: { blackListToken: ExpiredToken }});
        res.status(200).send("Usuario deslogeado");
    }
}

module.exports = {
    controller
}