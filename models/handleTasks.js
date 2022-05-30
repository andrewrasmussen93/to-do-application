const Mongo = require('../models/Mongo');
const { Task, Archive } = require('../models/Task');

module.exports = {
    // Get one or more tasks.
    getTask: async function(query, sort) {
        try {
            const database = await Mongo.mongoConnect(); // Connection to the database.
            const tasks = await Task.find(query, null, sort); // Find task based on query, possibility for sorting.
            database.close(); // Close database connection.
            return tasks; // Return what was found.
        } catch (error) {
            console.log(`Error in getting one or more tasks -> ${error}`);
        }
    },
}