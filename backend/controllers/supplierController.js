const supplierService = require("../services/supplierService");

/**
 * Lấy tất cả các nhà cung cấp
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getAllSuppliers = async (req, res) => {
    try {
        const suppliers = await supplierService.getAllSuppliers();
        res.json(suppliers);
    } catch (error) {
        console.error("Error fetching suppliers:", error);
        res.status(500).json({ error: "Không thể lấy danh sách nhà cung cấp" });
    }
};

/**
 * Tạo nhà cung cấp mới
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const createSupplier = async (req, res) => {
    try {
        const supplier = await supplierService.createSupplier(req.body);
        res.status(201).json(supplier);
    } catch (error) {
        console.error("Error adding supplier:", error);
        const statusCode = error.status || 500;
        const message = error.message || "Không thể thêm nhà cung cấp";
        res.status(statusCode).json({ error: message });
    }
};

/**
 * Cập nhật thông tin nhà cung cấp
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updateSupplier = async (req, res) => {
    try {
        const { id } = req.params;
        const supplier = await supplierService.updateSupplier(id, req.body);
        res.json(supplier);
    } catch (error) {
        console.error("Error updating supplier:", error);
        const statusCode = error.status || 500;
        const message = error.message || "Không thể cập nhật nhà cung cấp";
        res.status(statusCode).json({ error: message });
    }
};

/**
 * Xóa nhà cung cấp
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const deleteSupplier = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await supplierService.deleteSupplier(id);
        res.json(result);
    } catch (error) {
        console.error("Error deleting supplier:", error);
        const statusCode = error.status || 500;
        const message = error.message || "Không thể xóa nhà cung cấp";
        res.status(statusCode).json({ error: message });
    }
};

module.exports = {
    getAllSuppliers,
    createSupplier,
    updateSupplier,
    deleteSupplier,
};
