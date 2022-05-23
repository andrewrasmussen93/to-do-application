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
    // Create a new task.
    postTask: async function(req, success) {
        try {
            const database = await Mongo.mongoConnect(); // Connection to the database.
            // Set values for new task.
            const task = new Task({
                title: req.body.title,
                description: req.body.description,
                deadline: req.body.deadline ? req.body.deadline : null,
                startDate: new Date(),
                user: req.session.user[0]._id ? req.session.user[0]._id : null // Attach created task to session user.
            });
            // Create the new task in the database.
            // TODO: Make sure to validate the data before sending it to the database.
            Task.create(task, function(error) {
                if (error) {
                    console.log(`Error in creating a new task to the database -> ${error}`);
                    success(false);
                } else {
                    success(true);
                    database.close(); // Close database connection.
                    console.log(task); // Only used for testing purposes.
                }
                
            });
        } catch (error) {
            console.log(`Error in posting a new task -> ${error}`);
        }
    },
    // Delete and archive a task.
    deleteTask: async function(query) {
        try {
            const database = await Mongo.mongoConnect(); // Connection to the database.
            const task = await Task.find(query); // Find task based on query.
            await Archive.insertMany(task); // Insert the task to archive.
            await Task.deleteOne(query); // Delete the task.
            database.close(); // Close database connection.
        } catch (error) {
            console.log(`Error in deleting a task -> ${error}`);
        }
    },
    // Update a task.
    updateTask: async function(query, update) {
        try {
            const database = await Mongo.mongoConnect(); // Connection to the database.
            await Task.findOneAndUpdate(query, update, { new: true }); // Find task based on query and update specified parameter.
            database.close(); // Close database connection.
        } catch (error) {
            console.log(`Error in updating a task -> ${error}`);
        }
    }
}