const publisherModel = require("../models/publisherModel");

const getAllPublishers = async (req, res) => {
    try {
        const publishers = await publisherModel.getAllPublishers();
        res.json(publishers);
    } catch (error) {
        console.error("Error fetching publishers:", error);
        res.status(500).json({ error: "Failed to fetch publishers" });
    }
};

const createPublisher = async (req, res) => {
    try {
        const publisher = await publisherModel.createPublisher(req.body);
        res.status(201).json(publisher);
    } catch (error) {
        console.error("Error adding publisher:", error);
        res.status(500).json({ error: "Failed to add publisher" });
    }
};

const updatePublisher = async (req, res) => {
    try {
        const { id } = req.params;
        const publisher = await publisherModel.updatePublisher(id, req.body);
        res.json(publisher);
    } catch (error) {
        console.error("Error updating publisher:", error);
        res.status(500).json({ error: error.message || "Failed to update publisher" });
    }
};

const deletePublisher = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await publisherModel.deletePublisher(id);
        res.json(result);
    } catch (error) {
        console.error("Error deleting publisher:", error);
        res.status(500).json({ error: error.message || "Failed to delete publisher" });
    }
};

module.exports = {
    getAllPublishers,
    createPublisher,
    updatePublisher,
    deletePublisher,
};
