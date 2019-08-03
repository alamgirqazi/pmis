const attachmentupload = require('./../config/attachment_upload');

const express = require('express');
const router = express.Router();

const ProjectsController = require('../controllers/projects.controllers');
const checkAuth = require('../middleware/check-auth');

// router.get("/",ProjectsController.sampleProjects);
router.get('/', ProjectsController.getAll);
router.get('/getnextid', ProjectsController.getNextId);
router.get('/detail/:_id', ProjectsController.getProjectDetail);
router.get('/objectives/_id/:_id', ProjectsController.getObjectivesOfUser);
router.post('/', ProjectsController.addProject);
router.put('/:_id', ProjectsController.updateProject);
router.post('/:_id/attachments',attachmentupload.single('file'), ProjectsController.updateProjectAttachment);
router.delete('/:_id', ProjectsController.deleteProject);
// router.get("/",checkAuth,ProjectsController.sampleProjects);
module.exports = router;
