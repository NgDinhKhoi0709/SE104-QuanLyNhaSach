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

const searchPublishers = async (req, res) => {
    try {
        const keyword = req.query.q || "";
        const publishers = await publisherModel.searchPublishers(keyword);
        res.json(publishers);
    } catch (error) {
        console.error("Error searching publishers:", error);
        res.status(500).json({ error: "Failed to search publishers" });
    }
};

module.exports = {
    getAllPublishers,
    searchPublishers,
};
