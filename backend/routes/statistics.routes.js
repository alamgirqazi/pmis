const express = require("express");
const router = express.Router();

const StatisticsController = require('../controllers/statistics.controllers');

// router.get("/",ActivitiesController.sampleObjectives);
router.get("/getall",StatisticsController.getAllStatistics);

// router.get("/",checkAuth,ActivitiesController.sampleObjectives);
module.exports = router;
