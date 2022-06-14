const mongoose = require('mongoose');
const brypt = require('bcryptjs');
const { Schema } = mongoose;

const userSchema = new Schema({
    nombre: String,
    apellidoPaterno: String,
    apellidoMaterno: String,
    numeroTelefonico: Number,
    correo: String,
    nombreUsuario: String,
    password: String,
    blackListToken: Array
}, {
    timestamps: true,
    versionKey: false
});

userSchema.statics.encryptPassword = async (password) => {
    const salt = await brypt.genSalt(10);
    return await brypt.hash(password, salt);
}
userSchema.statics.comparePassword = async (password, recivedPassword) => {
    return await brypt.compare(password, recivedPassword);
}

module.exports = mongoose.model('Users', userSchema);