'use strict';

const router = require("express").Router();

const validateData = require("../middlewares/validateData");
const usersValidation = require("../middlewares/schemasValidation/users.validation");
const { verifySession, clearBlackList } = require("../middlewares/verifyToken");

const { controller } = require("../controllers/users.controller");

router.post("/registro", validateData(usersValidation), controller.registro);
router.post("/login", controller.logIn);
router.get("/consulta", verifySession, controller.consulta);
router.post("/logout", [verifySession, clearBlackList], controller.logOut);

module.exports = router;