const publisherService = require("../services/publisherService");

const getAllPublishers = async (req, res) => {
    try {
        const publishers = await publisherService.getAllPublishers();
        res.json(publishers);
    } catch (error) {
        console.error("Error fetching publishers:", error);
        res.status(500).json({ error: "Failed to fetch publishers" });
    }
};

const searchPublishers = async (req, res) => {
    try {
        const keyword = req.query.q || "";
        const publishers = await publisherService.searchPublishers(keyword);
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
