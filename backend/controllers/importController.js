const importService = require("../services/importService");

const getAllImports = async (req, res) => {
    try {
        const result = await importService.getAllImports();
        res.json(result);
    } catch (error) {
        console.error("Error fetching imports:", error);
        res.status(500).json({ error: "Failed to fetch imports" });
    }
};

const createImport = async (req, res) => {
    try {
        console.log("[IMPORT CONTROLLER] Dữ liệu nhận được:", req.body);
        const result = await importService.createImport(req.body);
        res.status(201).json(result);
    } catch (error) {
        console.error("[IMPORT CONTROLLER] Error creating import:", error);
        res.status(500).json({ error: error.message, details: error });
    }
};

const deleteImport = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await importService.deleteImport(id);
        res.json(result);
    } catch (error) {
        console.error("Error deleting import:", error);
        res.status(500).json({ error: error.message || "Failed to delete import" });
    }
};

const getImportStatsByYear = async (req, res) => {
    try {
        const { year } = req.query;
        const stats = await importService.getImportStatsByYear(year);
        res.json(stats);
    } catch (error) {
        console.error("Error fetching import statistics by year:", error);
        
        if (error.message === "Year parameter is required") {
            return res.status(400).json({ error: error.message });
        }
        
        res.status(500).json({ error: "Failed to fetch import statistics" });
    }
};

const getImportsByYear = async (req, res) => {
    try {
        const { year } = req.query;
        const imports = await importService.getImportsByYear(year);
        res.json(imports);
    } catch (error) {
        console.error("Error fetching imports by year:", error);
        
        if (error.message === "Year parameter is required") {
            return res.status(400).json({ error: error.message });
        }
        
        res.status(500).json({ error: "Failed to fetch imports" });
    }
};

module.exports = {
    getAllImports,
    createImport,
    deleteImport,
    getImportStatsByYear,
    getImportsByYear
};
