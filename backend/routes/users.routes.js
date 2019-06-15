const express = require("express");
const router = express.Router();

const UserController = require('./../controllers/users.controllers');
const checkAuth = require('../middleware/check-auth');
const upload = require('./../config/upload');

// router.get("/",UserController.sampleUser);
router.get("/",UserController.getAll);
router.get("/statistics",UserController.usersStatistics);
router.get("/getnextid",UserController.getNextId);
router.post("/",UserController.addUser);
router.put("/:_id", UserController.updateUser);
router.delete("/:_id", UserController.deleteUser);
router.put("/:type/:id",upload.single('file'), UserController.uploadAvatar);

// router.get("/",checkAuth,UserController.sampleUser);
module.exports = router;
