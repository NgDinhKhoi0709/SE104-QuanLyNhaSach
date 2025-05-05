const importModel = require("../models/importModel");

const getAllImports = async (req, res) => {
    try {
        const imports = await importModel.getAllImports();
        res.json(imports);
    } catch (error) {
        console.error("Error fetching imports:", error);
        res.status(500).json({ error: "Failed to fetch imports" });
    }
};

const createImport = async (req, res) => {
    try {
        const result = await importModel.createImport(req.body);
        res.status(201).json(result);
    } catch (error) {
        console.error("Error creating import:", error.message); // Log only the error message
        res.status(500).json({ error: error.message }); // Return the error message to the client
    }
};

module.exports = {
    getAllImports,
    createImport,
    // ...other CRUD if needed...
};
