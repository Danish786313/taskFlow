// Danish ahmad khan
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 2000;
const { sequelize } = require('./models');
const router = require('./routes/routes');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', router);

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
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
