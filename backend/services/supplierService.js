const supplierModel = require("../models/supplierModel");

/**
 * Lấy tất cả nhà cung cấp
 * @returns {Promise<Array>} Danh sách các nhà cung cấp
 */
const getAllSuppliers = async () => {
    return await supplierModel.getAllSuppliers();
};

/**
 * Lấy thông tin nhà cung cấp theo ID
 * @param {number} id - ID của nhà cung cấp
 * @returns {Promise<Object>} Thông tin nhà cung cấp
 */
const getSupplierById = async (id) => {
    const supplier = await supplierModel.getSupplierById(id);
    if (!supplier) {
        throw { status: 404, message: "Không tìm thấy nhà cung cấp" };
    }
    return supplier;
};

const createSupplier = async (supplierData) => {
    const { name, address, phone, email } = supplierData;
    
    if (!name || !address || !phone) {
        throw { status: 400, message: "Tên, địa chỉ và số điện thoại là bắt buộc" };
    }
    
    return await supplierModel.createSupplier(supplierData);
};

const updateSupplier = async (id, supplierData) => {
    const { name, address, phone, email } = supplierData;
    if (!name || !address || !phone) {
        throw { status: 400, message: "Tên, địa chỉ và số điện thoại là bắt buộc" };
    }
    try {
        return await supplierModel.updateSupplier(id, supplierData);
    } catch (error) {
        if (error.message === "Supplier not found") {
            throw { status: 404, message: "Không tìm thấy nhà cung cấp" };
        }
        throw error;
    }
};

const deleteSupplier = async (id) => {
    try {
        return await supplierModel.deleteSupplier(id);
    } catch (error) {
        if (error.message === "Supplier not found") {
            throw { status: 404, message: "Không tìm thấy nhà cung cấp" };
        }
        throw error;
    }
};

module.exports = {
    getAllSuppliers,
    getSupplierById,
    createSupplier,
    updateSupplier,
    deleteSupplier,
};
