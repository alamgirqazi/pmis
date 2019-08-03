const express = require("express");
const router = express.Router();
const attachmentupload = require('./../config/attachment_upload');

const ObjectivesController = require('../controllers/objectives.controllers');
const checkAuth = require('../middleware/check-auth');

// router.get("/",ObjectivesController.sampleObjectives);
router.get("/",ObjectivesController.getAll);
// router.get("/objectives/_id/:_id",ObjectivesController.getObjectivesOfUser);
// router.get("/statistics",ObjectivesController.ObjectivesStatistics);
router.post("/",ObjectivesController.addObjective);
router.post("/insertmany/",ObjectivesController.addManyObjectives);
router.post('/:_id/attachments/:objective_id',attachmentupload.single('file'), ObjectivesController.updateAttachment);

router.put("/:_id", ObjectivesController.updateObjective);
router.delete("/:_id", ObjectivesController.deleteObjective);
// router.get("/",checkAuth,ObjectivesController.sampleObjectives);
module.exports = router;
