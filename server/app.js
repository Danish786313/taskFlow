// Danish ahmad khan
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 2000;
const { sequelize } = require('./models');
const router = require('./routes/routes');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 1. Backend API routes FIRST
app.use('/api', router);

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 2. Serve static files from the React build folder (Vite outputs to client/dist)
const buildPath = path.join(__dirname, '../client/dist');
app.use(express.static(buildPath));

// 3. Catch-all route to support client-side routing (e.g., React Router)
// Note: Express 5+ uses '{*path}' instead of '*' for wildcards
app.get('{*path}', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
});

// Start server
app.listen(PORT, async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        console.log('Database connected and synchronized successfully.');
    } catch (err) {
        console.warn('Database connection warning (check MySQL configuration):', err.message);
    }
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
