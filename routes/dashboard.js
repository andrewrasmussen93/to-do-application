const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const taskController = require('../controllers/taskController');

let errorMessage;

// GET route for dashboard view.
router.get('/', taskController.getDashboard);

// POST route for create task form.
router.post('/', async (req, res) => {
    try {
        if (req.session.loggedIn) {
            await taskController.postTask(req, function(success) {
                if (success) {
                    res.redirect('/dashboard');
                } else {
                    errorMessage = 'Not a valid date. Please try again.';
                    res.redirect('/dashboard');
                }
            });
        } else {
            res.redirect('/');
        }
    } catch (error) {
        res.json({ message: `Error in creating a new task route -> ${error.message}` });
    }
});

// GET route for log out.
router.get('/logout', (req, res) => {
    req.session.loggedIn ? req.session.loggedIn = false : req.session.loggedIn = false;
    req.session.user ? req.session.user = undefined : req.session.user = undefined;    
    res.redirect('/');
});

// GET route for deleting and archiving a task.
router.get('/delete/:id', async (req, res) => {
    try {
        if (req.session.loggedIn) {
            await taskController.deleteTask({ "_id": req.params.id }); // Find task based on id, archive and delete it.        
            res.redirect('/dashboard');
        } else {
            res.redirect('/');
        }
    } catch (error) {
        res.json({ message: `Error in deleting a task route -> ${error.message}` });
    }
});

// GET route for marking a task as complete.
router.get('/complete/:id', async (req, res) => {
    try {
        if (req.session.loggedIn) {
            await taskController.updateTask({ "_id": req.params.id }, { "completed": true }); // Find task based on id and mark it as complete.
            res.redirect('/dashboard');
        } else {
            res.redirect('/');
        }
    } catch (error) {
        res.json({ message: `Error in marking a task as complete route -> ${error.message}` });
    }
});

// GET route for marking a task as incomplete.
router.get('/restore/:id', async (req, res) => {
    try {
        if (req.session.loggedIn) {
            await taskController.updateTask({ "_id": req.params.id }, { "completed": false }); // Find task based on id and mark it as incomplete.
            res.redirect('/dashboard');
        } else {
            res.redirect('/');
        }
    } catch (error) {
        res.json({ message: `Error in marking a task as incomplete route -> ${error.message}` });
    }
});

module.exports = router;