const express = require("express");
const router = express.Router();
const upload = require('./../config/upload');

const inventoryController = require('../controllers/inventory.controllers');

router.get("/", inventoryController.getAll);
router.get("/everything", inventoryController.getEverything);
router.get("/getnextid", inventoryController.getNextId);

router.get("/statistics", inventoryController.inventoryStatistics);
router.post("/", inventoryController.addInventory);
router.post("/fileimport",upload.single('file'), inventoryController.imporInventoryFile);

router.put("/:_id", inventoryController.updateInventory);
router.delete("/:_id", inventoryController.deleteInventory);
// router.get("/test", AssetsController.test);
// router.get("/insertRandom", AssetsController.insertRandom);

module.exports = router;
