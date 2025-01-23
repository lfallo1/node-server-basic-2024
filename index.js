const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');

const app = express();
const port = 3000;

// Enable CORS
app.use(cors());

// Helper function to read JSON files
const readJsonFile = (filePath) => {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
};

// Existing REST endpoints
app.get('/appdata', (req, res) => {
    try {
        const appData = readJsonFile(path.join(__dirname, 'data', 'appdata.json'));
        res.json(appData);
    } catch (error) {
        res.status(500).json({ error: 'Error reading app data' });
    }
});

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

// Set up Apollo Server
async function startApolloServer() {
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        formatError: (err) => {
            console.error(err);
            return err;
        },
    });

    await server.start();

    server.applyMiddleware({
        app,
        path: '/graphql',
        cors: true // Enable CORS for GraphQL endpoint
    });
}

// Start the server
startApolloServer().then(() => {
    app.listen(port, () => {
        console.log(`🚀 Server ready at http://localhost:${port}`);
        console.log(`🚀 GraphQL endpoint ready at http://localhost:${port}/graphql`);
    });
});