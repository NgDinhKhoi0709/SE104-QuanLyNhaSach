const importModel = require("../models/importModel");

const getAllImports = async () => {
    const imports = await importModel.getAllImports();
    // Map dữ liệu từ model sang định dạng cần thiết
    const result = imports.map(imp => ({
        id: imp.id,
        importCode: imp.id,
        date: imp.import_date,
        supplier: imp.supplier,
        importedBy: imp.employee,
        total: imp.total_price,
        bookDetails: imp.bookDetails.map(d => ({
            id: d.id,
            bookId: d.book_id,
            book: d.book,
            quantity: d.quantity,
            price: d.price
        }))
    }));
    return result;
};

const createImport = async (importData) => {
    return await importModel.createImport(importData);
};

const deleteImport = async (id) => {
    return await importModel.deleteImport(id);
};

const getImportStatsByYear = async (year) => {
    if (!year) {
        throw new Error("Year parameter is required");
    }
    return await importModel.getImportStatsByYear(year);
};

const getImportsByYear = async (year) => {
    if (!year) {
        throw new Error("Year parameter is required");
    }
    const imports = await importModel.getImportsByYear(year);
    // Giữ định dạng dữ liệu tương tự getAllImports
    return imports.map(imp => ({
        id: imp.id,
        importCode: imp.id,
        date: imp.import_date,
        supplier: imp.supplier,
        importedBy: imp.employee,
        total: imp.total_price,
        bookDetails: imp.bookDetails.map(d => ({
            id: d.id,
            bookId: d.book_id,
            book: d.book,
            quantity: d.quantity,
            price: d.price
        }))
    }));
};

module.exports = {
    getAllImports,
    createImport,
    deleteImport,
    getImportStatsByYear,
    getImportsByYear
};
