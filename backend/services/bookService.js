const bookModel = require("../models/bookModel");

const getAllBooks = async () => {
    return await bookModel.getAllBooks();
};

const getBookById = async (id) => {
    return await bookModel.getBookById(id);
};

const createBook = async (bookData) => {
    return await bookModel.createBook(bookData);
};

const updateBook = async (id, bookData) => {
    return await bookModel.updateBook(id, bookData);
};

const deleteBook = async (id) => {
    return await bookModel.deleteBook(id);
};

const getOldStockBooks = async (months = 2) => {
    return await bookModel.getOldStockBooks(months);
};

module.exports = {
    getAllBooks,
    getBookById,
    createBook,
    updateBook,
    deleteBook,
    getOldStockBooks,
};
