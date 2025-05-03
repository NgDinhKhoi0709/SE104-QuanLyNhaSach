const supplierModel = require("../models/supplierModel");

const getAllSuppliers = async (req, res) => {
    try {
        const suppliers = await supplierModel.getAllSuppliers();
        res.json(suppliers);
    } catch (error) {
        console.error("Error fetching suppliers:", error);
        res.status(500).json({ error: "Failed to fetch suppliers" });
    }
};

const createSupplier = async (req, res) => {
    try {
        const supplier = await supplierModel.createSupplier(req.body);
        res.status(201).json(supplier);
    } catch (error) {
        console.error("Error adding supplier:", error);
        res.status(500).json({ error: "Failed to add supplier" });
    }
};

const updateSupplier = async (req, res) => {
    try {
        const { id } = req.params;
        const supplier = await supplierModel.updateSupplier(id, req.body);
        res.json(supplier);
    } catch (error) {
        console.error("Error updating supplier:", error);
        res.status(500).json({ error: error.message || "Failed to update supplier" });
    }
};

const deleteSupplier = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await supplierModel.deleteSupplier(id);
        res.json(result);
    } catch (error) {
        console.error("Error deleting supplier:", error);
        res.status(500).json({ error: error.message || "Failed to delete supplier" });
    }
};

module.exports = {
    getAllSuppliers,
    createSupplier,
    updateSupplier,
    deleteSupplier,
};
