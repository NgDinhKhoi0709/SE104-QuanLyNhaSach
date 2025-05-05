const express = require('express');
const app = express();
const userRoutes = require('./routes/userRoutes'); // Đảm bảo đường dẫn đúng
const cors = require('cors');

// Middleware to parse JSON
app.use(express.json());

// Enable CORS
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Debugging middleware - Log request details
app.use((req, res, next) => {
    console.log(`--> ${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
    if (Object.keys(req.body).length > 0) {
        console.log('    Request Body:', JSON.stringify(req.body, null, 2));
    }
    next();
});

// --- MOUNT ROUTES ---
// Chỉ mount userRoutes một lần cho đường dẫn /api/accounts
console.log('Mounting /api/accounts route...');
app.use('/api/accounts', userRoutes);
console.log('/api/accounts route mounted.');

// Nếu bạn có các router khác, mount chúng ở đây
// Ví dụ: app.use('/api/books', bookRoutes);

// --- ERROR HANDLING ---
// Catch-all route cho các request không khớp (phải đặt SAU các route hợp lệ)
app.use('*', (req, res) => {
    console.error(`!!! Route Not Found: ${req.method} ${req.originalUrl}`);
    res.status(404).json({ error: `Endpoint không tồn tại: ${req.method} ${req.originalUrl}` });
});

// General error handler (phải đặt cuối cùng)
app.use((err, req, res, next) => {
    console.error('!!! Server Error:', err);
    // Trả về lỗi JSON
    if (!res.headersSent) {
        res.status(err.status || 500).json({ error: err.message || 'Đã xảy ra lỗi máy chủ!' });
    }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Backend server is running on http://localhost:${PORT}`);
});