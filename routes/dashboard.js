const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const taskController = require('../controllers/taskController');

let errorMessage;

// GET route for dashboard view.
router.get('/', taskController.getDashboard);

// POST route for create task form.
router.post('/', taskController.createTask);

// GET route for log out.
router.get('/logout', taskController.logout);

// GET route for deleting and archiving a task.
router.get('/delete/:id', taskController.archiveTask);

// GET route for marking a task as complete.
router.get('/complete/:id', taskController.completeTask);

// GET route for marking a task as incomplete.
router.get('/restore/:id', taskController.restoreTask);

module.exports = router;