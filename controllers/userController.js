const bcrypt = require('bcrypt');
const Mongo = require('../models/Mongo');
const User = require('../models/User');
const handleUsers = require('../models/handleUsers');

let signUpSuccess;
let signUpError;
let loginResponse;

module.exports = {
    // GET login page.
    getIndex: (req, res) => {
        // If a user is already logged in, redirect them to the dashboard.
        if (req.session.loggedIn) {
            res.redirect('/dashboard');
        }
        // If a user isn't logged in, render index view.
        else {
            res.render('index', {
                title: 'To-Do Application',
                signUpSuccess: signUpSuccess ? signUpSuccess : '',
                signUpError: signUpError ? signUpError : '',
                loginResponse: loginResponse ? loginResponse : '',
            });
            signUpSuccess = '';
            signUpError = '';
            loginResponse = '';
        }
    },
    // Create a new user.
    createUser: async (req, res) => {
        try {
            await handleUsers.postUser(req, function(success) {
                if (success) {
                    signUpSuccess = 'User created successfully. You can now login.';
                    res.redirect('/');
                } else {
                    signUpError = 'Username invalid or already exists. Please pick another.';
                    // TODO: Figure out how to make two separate error messages.
                    res.redirect('/#signUpForm');
                }
            });
        } catch (error) {
            res.send(error);
        }
    },
    // Login a user.
    loginUser: async function(req) {
        try {
            const database = await Mongo.mongoConnect(); // Connection to the database.
            const user = await User.find({ "username": req.body.username }); // Search for username which matches the given req.body.
            // Check if user exists.
            if (user.length > 0) {
                const isPasswordIdentical = await bcrypt.compare(req.body.password, user[0].password); // Compare the password received from req.body with the password matching the user in the database.
                if (isPasswordIdentical) {
                    database.close();
                    return user; // If the passwords match, return the user.
                } else {
                    return false; // If the passwords don't match, return false.
                }
            } else {
                return false; // If the user doesn't exist, return false.
                // TODO: Find a way to show the user if it's the username that doesn't exist or the password that doesn't match.
            }
        } catch (error) {
            console.log(`Error in user login -> ${error}`);
        }
    }
};