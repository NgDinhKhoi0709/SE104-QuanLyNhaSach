const db = require("../db");

const getAllPublishers = async () => {
    const [rows] = await db.query(
        "SELECT id, name FROM publishers"
    );
    return rows;
};

const searchPublishers = async (keyword) => {
    const like = `${keyword}%`;
    const [rows] = await db.query(
        `SELECT id, name
         FROM publishers
         WHERE name LIKE ?
         ORDER BY name ASC`,
        [like]
    );
    return rows;
};

module.exports = {
    getAllPublishers,
    searchPublishers,
};
