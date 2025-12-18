// Import express and ejs
var express = require ('express');
var ejs = require('ejs');
var mysql = require('mysql2');
const path = require('path');
var session = require('express-session');

// Create the express application object
const app = express();
const port = 8000;

// Tell Express that we want to use EJS as the templating engine
app.set('view engine', 'ejs');

// Set up the body parser 
app.use(express.urlencoded({ extended: true }));

// Set up public folder (for css and static js)
app.use(express.static(path.join(__dirname, 'public')));

// Define our application-specific data
app.locals.nameData = {appName: "Fitness App"};

// Define the database connection pool
const db = mysql.createPool({
    host: 'localhost',
    // The database and user created by `create_db.sql` are `fitness_app` / `fitness_app_user`.
    // Update these to match the schema script so the app can access the `users` table.
    user: 'fitness_app_user',
    password: 'qwertyuiop',
    database: 'fitness_app',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});
global.db = db;

// create a session
app.use(session({
    secret: 'somerandomstuff',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000
    }
}));

// Load the route handlers
const mainRoutes = require("./routes/main");
app.use('/', mainRoutes);

//  Load the route handlers for /users
const usersRoutes = require('./routes/users');
app.use('/users', usersRoutes);
/*
// Load the route handlers for /scores
const scoresRoutes = require('./routes/scores');
app.use('/scores', scoresRoutes);
*/
// Start the web app listening
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
