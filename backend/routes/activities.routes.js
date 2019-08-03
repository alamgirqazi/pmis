const express = require("express");
const router = express.Router();
const attachmentupload = require('./../config/attachment_upload');

const ActivitiesController = require('../controllers/activities.controllers');
const checkAuth = require('../middleware/check-auth');

// router.get("/",ActivitiesController.sampleObjectives);
router.get("/",ActivitiesController.getAll);
// router.get("/objectives/_id/:_id",ActivitiesController.getObjectivesOfUser);
// router.get("/statistics",ActivitiesController.ObjectivesStatistics);
router.post("/",ActivitiesController.addActivity);
router.post("/insertmany/",ActivitiesController.addManyActivities);
router.post('/:_id/attachments/:activity_id',attachmentupload.single('file'), ActivitiesController.updateAttachment);

router.put("/:_id", ActivitiesController.updateActivity);
router.delete("/:_id", ActivitiesController.deleteActivity);
// router.get("/",checkAuth,ActivitiesController.sampleObjectives);
module.exports = router;
