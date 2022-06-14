const Joi = require('joi');

const schema = Joi.object({
    nombre: Joi.string().alphanum().max(40).required(),
    apellidoPaterno: Joi.string().alphanum().max(40).required(),
    apellidoMaterno: Joi.string().alphanum().max(40),
    numeroTelefonico: Joi.number().positive().max(9999999999).required(),
    correo: Joi.string().max(40).email().trim(true),
    nombreUsuario: Joi.string().alphanum().max(30).required(),
    password: Joi.string().max(20).required()
});

module.exports = schema;