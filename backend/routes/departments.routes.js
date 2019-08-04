const express = require("express");
const router = express.Router();

const departmentsController = require('../controllers/departments.controllers');
const upload = require('../config/upload');

// router.get("/",departmentsController.sampleDepartment);
router.get("/",departmentsController.getAll);
router.get("/get/all/departments",departmentsController.getAllDepartments);
router.get("/:_id",departmentsController.getSingleDepartment);
router.get("/getnextid/next",departmentsController.getNextId);
router.post("/",departmentsController.addDepartment);
router.put("/:_id", departmentsController.updateDepartments);
router.delete("/:_id", departmentsController.deleteDepartment);

module.exports = router;
