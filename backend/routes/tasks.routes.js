const express = require("express");
const router = express.Router();

const TasksController = require('../controllers/tasks.controllers');
const checkAuth = require('../middleware/check-auth');

// router.get("/",TasksController.sampleObjectives);
router.get("/",TasksController.getAll);
// router.get("/objectives/_id/:_id",TasksController.getObjectivesOfUser);
// router.get("/statistics",TasksController.ObjectivesStatistics);
router.post("/",TasksController.addTask);
router.post("/insertmany/",TasksController.addManyTasks);
router.put("/:_id", TasksController.updateTasks);
router.delete("/:_id", TasksController.deleteTask);
// router.get("/",checkAuth,TasksController.sampleObjectives);
module.exports = router;
