const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

let signUpSuccess;
let signUpError;
let loginResponse;

// GET route for index view.
router.get('/', (req, res) => {
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
});

// POST route for sign up form.
router.post('/', async (req, res) => {
    try {
        await userController.postUser(req, function(success) {
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
});

// POST route for login form.
router.post('/login', async (req, res) => {
    try {
        const user = await userController.loginUser(req); // Check if user exist and if passwords match.
        // If user exists and passwords match, login user.
        if (user) {
            req.session.user = user; // Save the user in a browser session.
            req.session.loggedIn = true; // Used for checking if a user is logged in or not.
            // If session user id matches user id from database, render the dashboard with that specific users username and tasks.
            if (req.session.user[0]._id.toString() === user[0]._id.toString()) {
                res.redirect(`/dashboard`);
            }
        }
        // If user doesn't exist or passwords don't match, render index view with login error message.
        else {
            loginResponse = 'Wrong username or password. Please try again.';
            res.redirect('/');
        }
    } catch (error) {
        res.send(error);
    }
});

module.exports = router;