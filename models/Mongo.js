const mongoose = require('mongoose');

module.exports = {
    // Connection to the database.
    mongoConnect: async function() {
        const databaseServer = '0.0.0.0';
        const databaseName = 'todo';
        const connectionString = `mongodb://${databaseServer}:27017/${databaseName}`;
        const params = { useNewUrlParser: true, useUnifiedTopology: true} // TODO: Figure out what this means.
        await mongoose.connect(process.env.MONGODB_URI || connectionString, params);
        return mongoose.connection;
    }
};