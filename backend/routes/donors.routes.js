const express = require("express");
const router = express.Router();

const donorsController = require('../controllers/donors.controllers');

// router.get("/",donorsController.sampleDonor);
router.get("/",donorsController.getAll);
router.get("/:_id",donorsController.getSingleDonor);
router.get("/getnextid/next",donorsController.getNextId);
router.post("/",donorsController.addDonor);
router.put("/:_id", donorsController.updateDonors);
router.delete("/:_id", donorsController.deleteDonor);

module.exports = router;
