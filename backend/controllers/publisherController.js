const publisherService = require("../services/publisherService");

const getAllPublishers = async (req, res) => {
    try {
        const publishers = await publisherService.getAllPublishers();
        res.json(publishers);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch publishers" });
    }
};
module.exports = {
    getAllPublishers
};
