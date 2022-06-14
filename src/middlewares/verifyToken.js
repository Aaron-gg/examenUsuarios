const jwt = require('jsonwebtoken');
const { secretKey } = require('../config/keys');
const User = require('../models/users.model');

const verifySession = async (req, res, next) => {
    try {
        const token = req.headers["x-token"];
        if(!token) return res.status(401).send("No token provided");
        const decoded = jwt.verify(token, secretKey);
        req.userId = decoded.id;

        const user = await User.findById(decoded.id, {password: 0});
        if(!user) return res.status(401).send('No user found');

        if(user.blackListToken.includes(token)) return res.status(403).send('Session expired');
        next();
    }
    catch (error){
        return res.status(403).send('Unauthorized or session expired');
    }
}

const clearBlackList = async (req, res, next) => {
    const user = await User.findById(req.userId);
    const range = user.blackListToken.length;
    let n = 0;
    for(let i = 0; i < range; i++) {
        try{
            jwt.verify(element, secretKey);
        }
        catch(error){
            user.blackListToken.splice(n, 1);
            n--;
        }
        n++;
    }
    await User.findByIdAndUpdate(req.userId, {blackListToken: user.blackListToken});
    next();
}

module.exports = {
    verifySession,
    clearBlackList
}