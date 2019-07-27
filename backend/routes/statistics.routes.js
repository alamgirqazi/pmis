const express = require('express');
const router = express.Router();

const StatisticsController = require('../controllers/statistics.controllers');

// router.get("/",ActivitiesController.sampleObjectives);
router.get('/getall', StatisticsController.getAllStatistics);
router.get('/getall/projects', StatisticsController.getAllProjectsStatistics);
router.get(
  '/getall/objectives',
  StatisticsController.getAllObjectivesStatistics
);
router.get(
  '/getall/activities',
  StatisticsController.getAllActivitiesStatistics
);
router.get('/getall/tasks', StatisticsController.getAllTasksStatistics);
router.get('/getall/users', StatisticsController.getAllUsersStatistics);

// router.get("/",checkAuth,ActivitiesController.sampleObjectives);
module.exports = router;
