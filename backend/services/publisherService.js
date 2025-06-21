const publisherModel = require("../models/publisherModel");

const getAllPublishers = async () => {
    return await publisherModel.getAllPublishers();
};

const searchPublishers = async (keyword) => {
    return await publisherModel.searchPublishers(keyword);
};

module.exports = {
    getAllPublishers,
    searchPublishers,
};
