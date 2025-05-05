const bookModel = require("../models/bookModel");

const getAllBooks = async (req, res) => {
    try {
        const books = await bookModel.getAllBooks();
        res.json(books);
    } catch (error) {
        console.error("Error fetching books:", error);
        res.status(500).json({ error: "Failed to fetch books" });
    }
};

const createBook = async (req, res) => {
    try {
        const book = await bookModel.createBook(req.body);
        res.status(201).json(book);
    } catch (error) {
        console.error("Error adding book:", error);
        res.status(500).json({ error: "Failed to add book" });
    }
};

const updateBook = async (req, res) => {
    try {
        const { id } = req.params;
        const book = await bookModel.updateBook(id, req.body);
        res.json(book);
    } catch (error) {
        console.error("Error updating book:", error);
        res.status(500).json({ error: error.message || "Failed to update book" });
    }
};

const deleteBook = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await bookModel.deleteBook(id);
        res.json(result);
    } catch (error) {
        console.error("Error deleting book:", error);
        res.status(500).json({ error: error.message || "Failed to delete book" });
    }
};

module.exports = {
    getAllBooks,
    createBook,
    updateBook,
    deleteBook,
};