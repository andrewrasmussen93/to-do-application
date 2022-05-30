const Mongo = require('../models/Mongo');
const { Task, Archive } = require('../models/Task');
const handleTasks = require('../models/handleTasks');
const handleUsers = require('../models/handleUsers');

module.exports = {
    // GET dashboard page.
    getDashboard: async (req, res) => {
        try {
            // Check if a user is logged in.
            if (req.session.loggedIn) {
                const user = await handleUsers.getUser({ "_id": req.session.user[0]._id }); // Find user in database from req.session.
                const tasks = await handleTasks.getTask({ "user": req.session.user[0]._id, "completed": false }); // Find the tasks for the specific user, which isn't complete.
                const completeTasks = await handleTasks.getTask({ "user": req.session.user[0]._id, "completed": true }); // Find the tasks for the specific user, which is complete.
                // If session user id matches user id from database, render the dashboard with that specific users username and tasks.
                if (req.session.user[0]._id === user[0]._id.toString()) {
                    res.render('dashboard', {
                        title: 'Dashboard',
                        username: user[0].username,
                        tasks: tasks,
                        completeTasks: completeTasks ? completeTasks : null,
                        errorMessage: errorMessage ? errorMessage : ''
                    });
                    errorMessage = '';
                }
            }
            // If a user isn't logged in, redirect them to index page.
            else {
                res.redirect('/');
            }
        } catch (error) {
            res.send(error);
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