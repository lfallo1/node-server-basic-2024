// graphql/resolvers.js
const path = require('path');
const fs = require('fs');

const readJsonFile = (filePath) => {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
};

const writeJsonFile = (filePath, data) => {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
};

const getUserDataPath = () => path.join(__dirname, '..', 'data', 'userdata.json');

const resolvers = {
    Query: {
        appData: () => {
            const appData = readJsonFile(path.join(__dirname, '..', 'data', 'appdata.json'));
            console.log('📦 AppData Response:', appData);
            return appData;
        },
        user: (_, { username }) => {
            const userData = readJsonFile(getUserDataPath());
            const user = userData.users.find(u => u.profile.username === username);
            console.log('👤 User Response:', user);
            return user;
        },
        allUsers: () => {
            const userData = readJsonFile(getUserDataPath());
            console.log('👥 AllUsers Response:', userData.users);
            return userData.users;
        }
    },
    Mutation: {
        updateUserProfile: (_, { id, input }) => {
            const userData = readJsonFile(getUserDataPath());
            const userIndex = userData.users.findIndex(u => u.profile.id === id);

            if (userIndex === -1) {
                throw new Error(`User with ID ${id} not found`);
            }

            // Update only the provided fields
            const updatedProfile = {
                ...userData.users[userIndex].profile,
                ...input
            };

            // Validate email format if provided
            if (input.email && !input.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
                throw new Error('Invalid email format');
            }

            userData.users[userIndex].profile = updatedProfile;

            // Write updated data back to file
            writeJsonFile(getUserDataPath(), userData);

            console.log('✏️ Profile Updated:', updatedProfile);
            return updatedProfile;
        },

        updateUserPreferences: (_, { id, preferences }) => {
            const userData = readJsonFile(getUserDataPath());
            const userIndex = userData.users.findIndex(u => u.profile.id === id);

            if (userIndex === -1) {
                throw new Error(`User with ID ${id} not found`);
            }

            // Initialize preferences if they don't exist
            if (!userData.users[userIndex].preferences) {
                userData.users[userIndex].preferences = {};
            }

            // Update preferences
            userData.users[userIndex].preferences = {
                ...userData.users[userIndex].preferences,
                ...preferences
            };

            // Validate theme if provided
            if (preferences.theme && !['light', 'dark', 'system'].includes(preferences.theme)) {
                throw new Error('Invalid theme value');
            }

            // Validate language if provided
            if (preferences.language && !['en', 'es', 'fr', 'de'].includes(preferences.language)) {
                throw new Error('Invalid language value');
            }

            // Write updated data back to file
            writeJsonFile(getUserDataPath(), userData);

            console.log('⚙️ Preferences Updated:', userData.users[userIndex]);
            return userData.users[userIndex];
        }
    }
};

module.exports = resolvers;