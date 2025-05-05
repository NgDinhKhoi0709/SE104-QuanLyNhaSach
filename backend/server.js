const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const publisherRoutes = require('./routes/publisherRoutes');
const supplierRoutes = require('./routes/supplierRoutes');  // Added supplier routes
const bookRoutes = require('./routes/bookRoutes');  // Added book routes
const userRoutes = require('./routes/userRoutes'); // Thêm dòng này

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: "http://localhost:5173" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/publishers', publisherRoutes);
app.use('/api/suppliers', supplierRoutes);  // Mount supplier routes
app.use('/api/books', bookRoutes);  // Mount the book routes
app.use('/api/users', userRoutes); // Thêm dòng này

// Debug route
app.get("/api-test", (req, res) => {
    res.json({ message: "API is working" });
});

// Default route
app.get('/', (req, res) => {
    res.send('API is running');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});