const express = require("express");
const router = express.Router();
const publisherController = require("../controllers/publisherController");

router.get("/", publisherController.getAllPublishers);
router.post("/", publisherController.createPublisher);
router.put("/:id", publisherController.updatePublisher);
router.delete("/:id", publisherController.deletePublisher);

module.exports = router;
