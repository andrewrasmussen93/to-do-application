const express = require('express');
const session = require('express-session');
const app = express();
const port = process.env.PORT || 3000;
const path = require('path');
const dashboard = require('./routes/dashboard');
const index = require('./routes/index');

// Serve static assets.
app.use('/static', express.static(path.join(__dirname, 'public')));

// Set the view engine.
app.set('view engine', 'ejs');

// Used for parsing data with POST methods.
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: false
}));

// Routes:
app.use('/dashboard', dashboard);
app.use('/', index);

app.listen(port, () => {
    console.log(`Server listening on port: ${port}`);
});