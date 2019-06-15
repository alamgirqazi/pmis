const express = require("express");
const router = express.Router();

const AuthController = require('./../controllers/auth.controllers');

router.post("/", AuthController.login);
router.get("/setupadmin", AuthController.setupAdmin);

module.exports = router;
