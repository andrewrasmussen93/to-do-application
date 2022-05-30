const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// GET route for index view.
router.get('/', userController.getIndex);

// POST route for sign up form.
router.post('/', userController.createUser);

// POST route for login form.
router.post('/login', userController.login);

module.exports = router;