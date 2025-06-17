const express = require("express");
const router = express.Router();
const importController = require("../controllers/importController");

router.get("/", importController.getAllImports);
router.post("/", importController.createImport);
router.delete('/:id', importController.deleteImport);
router.get('/stats-by-year', importController.getImportStatsByYear);
router.get('/by-year', importController.getImportsByYear);

module.exports = router;
