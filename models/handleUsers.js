const bcrypt = require('bcrypt');
const Mongo = require('../models/Mongo');
const User = require('../models/User');

module.exports = {
    // Get one or more users.
    getUser: async function(query, sort) {
        try {
            const database = await Mongo.mongoConnect(); // Connection to the database.
            const users = await User.find(query, null, sort); // Find user based on query, possibility for sorting.
            database.close(); // Close database connection.
            return users; // Return what was found.
        } catch (error) {
            console.log(`Error in getting one or more users -> ${error}`);
        }
    },
    // Create a new user.
    postUser: async function(req, success) {
        try {
            const database = await Mongo.mongoConnect(); // Connection to the database.
            // Hash password received from req.body.
            bcrypt.hash(req.body.password, 10, function(error, hash) {
                if (error) {
                    console.log(`Error in hashing of password -> ${error}`);
                }
                // Set values for new user.
                const user = new User({
                    username: req.body.username,
                    password: hash
                });
                // Create the new user in the database.
                // TODO: Make sure to validate the data before sending it to the database.
                User.create(user, function(error) {
                    if (error) {
                        console.log(error);
                        success(false);
                    } else {
                        database.close(); // Close database connection.
                        console.log(user); // Only used for testing purposes.
                        success(true);
                    }
                });
            });
        } catch (error) {
            console.log(`Error in posting a new user -> ${error}`);
        }
    },
}