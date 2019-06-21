const express = require("express");
const router = express.Router();

const ObjectivesController = require('../controllers/objectives.controllers');
const checkAuth = require('../middleware/check-auth');

// router.get("/",ObjectivesController.sampleObjectives);
router.get("/",ObjectivesController.getAll);
// router.get("/objectives/_id/:_id",ObjectivesController.getObjectivesOfUser);
// router.get("/statistics",ObjectivesController.ObjectivesStatistics);
router.post("/",ObjectivesController.addObjective);
router.post("/insertmany/",ObjectivesController.addManyObjectives);
router.put("/:_id", ObjectivesController.updateObjective);
router.delete("/:_id", ObjectivesController.deleteObjective);
// router.get("/",checkAuth,ObjectivesController.sampleObjectives);
module.exports = router;
