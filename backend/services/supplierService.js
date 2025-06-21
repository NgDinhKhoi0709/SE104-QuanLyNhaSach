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

/**
 * Tạo nhà cung cấp mới
 * @param {Object} supplierData - Dữ liệu nhà cung cấp mới
 * @returns {Promise<Object>} Thông tin nhà cung cấp đã tạo
 */
const createSupplier = async (supplierData) => {
    // Kiểm tra dữ liệu đầu vào
    const { name, address, phone, email } = supplierData;
    
    if (!name || !address || !phone) {
        throw { status: 400, message: "Tên, địa chỉ và số điện thoại là bắt buộc" };
    }
    
    return await supplierModel.createSupplier(supplierData);
};

/**
 * Cập nhật thông tin nhà cung cấp
 * @param {number} id - ID của nhà cung cấp
 * @param {Object} supplierData - Dữ liệu cập nhật
 * @returns {Promise<Object>} Thông tin nhà cung cấp đã cập nhật
 */
const updateSupplier = async (id, supplierData) => {
    // Kiểm tra dữ liệu đầu vào
    const { name, address, phone, email } = supplierData;
    
    if (!name || !address || !phone) {
        throw { status: 400, message: "Tên, địa chỉ và số điện thoại là bắt buộc" };
    }

    try {
        // Kiểm tra xem nhà cung cấp có tồn tại không
        await getSupplierById(id);
        return await supplierModel.updateSupplier(id, supplierData);
    } catch (error) {
        if (error.message === "Supplier not found") {
            throw { status: 404, message: "Không tìm thấy nhà cung cấp" };
        }
        throw error;
    }
};

/**
 * Xóa nhà cung cấp
 * @param {number} id - ID của nhà cung cấp
 * @returns {Promise<Object>} Kết quả xóa
 */
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
