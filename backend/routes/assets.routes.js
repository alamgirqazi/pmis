const express = require("express");
const router = express.Router();
const upload = require('./../config/upload');

const AssetsController = require('./../controllers/assets.controllers');

router.get("/", AssetsController.getAll);
router.get("/everything", AssetsController.getEverything);
router.get("/getnextid", AssetsController.getNextId);
router.get("/imports", AssetsController.importAsset);
router.get("/statistics", AssetsController.assetStatistics);
router.post("/", AssetsController.addAsset);
router.post("/fileimport",upload.single('file'), AssetsController.importAssetFile);
router.put("/:_id", AssetsController.updateAsset);
router.delete("/:_id", AssetsController.deleteAsset);
router.get("/test", AssetsController.test);
// router.get("/insertRandom", AssetsController.insertRandom);

module.exports = router;
