const express = require("express");
const router = express.Router();
const importController = require("../controllers/importController");

router.get("/", importController.getAllImports);
router.post("/", importController.createImport);
router.delete('/:id', importController.deleteImport);

module.exports = router;
