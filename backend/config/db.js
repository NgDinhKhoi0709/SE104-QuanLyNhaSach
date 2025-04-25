const mysql = require('mysql2');

// Create connection pool
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',     // Default XAMPP MySQL username
    password: '',     // Default XAMPP MySQL password (empty)
    database: 'cnpm',  // Updated to the correct database name
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Convert to promise-based API
const promisePool = pool.promise();

// Test the connection
async function testConnection() {
    try {
        const [rows] = await promisePool.query('SELECT 1');
        console.log('Database connection successful');
        return true;
    } catch (error) {
        console.error('Database connection failed:', error);
        return false;
    }
}

// Execute connection test when the module is loaded
testConnection();

module.exports = promisePool;
