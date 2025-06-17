const importModel = require("../models/importModel");

const getAllImports = async (req, res) => {
    try {
        const imports = await importModel.getAllImports();
        // Map dữ liệu
        const result = await Promise.all(imports.map(async imp => {
            const details = imp.bookDetails; // đã gắn trong model
            return {
                id: imp.id,
                importCode: imp.id,           // hoặc tùy format bạn muốn
                date: imp.import_date,
                supplier: imp.supplier,
                importedBy: imp.employee,     // nếu cần
                total: imp.total_price,
                bookDetails: details.map(d => ({
                    id: d.id,
                    bookId: d.book_id,
                    book: d.book,
                    quantity: d.quantity,
                    price: d.price
                }))
            };
        }));
        res.json(result);
    } catch (error) {
        console.error("Error fetching imports:", error);
        res.status(500).json({ error: "Failed to fetch imports" });
    }
};

const createImport = async (req, res) => {
    try {
        console.log("[IMPORT CONTROLLER] Dữ liệu nhận được:", req.body);
        const result = await importModel.createImport(req.body);
        res.status(201).json(result);
    } catch (error) {
        console.error("[IMPORT CONTROLLER] Error creating import:", error);
        res.status(500).json({ error: error.message, details: error });
    }
};

const deleteImport = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await importModel.deleteImport(id);
        res.json(result);
    } catch (error) {
        console.error("Error deleting import:", error);
        res.status(500).json({ error: error.message || "Failed to delete import" });
    }
};

const getImportStatsByYear = async (req, res) => {
    try {
        const { year } = req.query;
        if (!year) {
            return res.status(400).json({ error: "Year parameter is required" });
        }

        const stats = await importModel.getImportStatsByYear(year);
        res.json(stats);
    } catch (error) {
        console.error("Error fetching import statistics by year:", error);
        res.status(500).json({ error: "Failed to fetch import statistics" });
    }
};

const getImportsByYear = async (req, res) => {
    try {
        const { year } = req.query;
        if (!year) {
            return res.status(400).json({ error: "Year parameter is required" });
        }

        const imports = await importModel.getImportsByYear(year);
        res.json(imports);
    } catch (error) {
        console.error("Error fetching imports by year:", error);
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
