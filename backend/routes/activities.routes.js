const express = require("express");
const router = express.Router();

const ActivitiesController = require('../controllers/activities.controllers');
const checkAuth = require('../middleware/check-auth');

// router.get("/",ActivitiesController.sampleObjectives);
router.get("/",ActivitiesController.getAll);
// router.get("/objectives/_id/:_id",ActivitiesController.getObjectivesOfUser);
// router.get("/statistics",ActivitiesController.ObjectivesStatistics);
router.post("/",ActivitiesController.addObjective);
router.post("/insertmany/",ActivitiesController.addManyObjectives);
router.put("/:_id", ActivitiesController.updateObjective);
router.delete("/:_id", ActivitiesController.deleteObjective);
// router.get("/",checkAuth,ActivitiesController.sampleObjectives);
module.exports = router;
