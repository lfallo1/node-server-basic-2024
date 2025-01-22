const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');  // Add this line

const app = express();
const port = 3000;

// Enable CORS for all routes
app.use(cors());

// If you need specific CORS configuration, you can do:
/*
app.use(cors({
    origin: ['http://localhost:3000', 'https://yourdomain.com'],  // Allowed origins
    methods: ['GET'],  // Allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'],  // Allowed headers
    credentials: true  // Allow credentials (cookies, authorization headers, etc.)
}));
*/

// Helper function to read JSON files
const readJsonFile = (filePath) => {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
};

// Endpoint for /appdata
app.get('/appdata', (req, res) => {
    try {
        const appData = readJsonFile(path.join(__dirname, 'data', 'appdata.json'));
        res.json(appData);
    } catch (error) {
        res.status(500).json({ error: 'Error reading app data' });
    }
});

// Endpoint for /user/:username
app.get('/user/:username', (req, res) => {
    try {
        const userData = readJsonFile(path.join(__dirname, 'data', 'userdata.json'));
        const user = userData.users.find(u => u.profile.username === req.params.username);

        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error reading user data' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});