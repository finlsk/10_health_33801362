// Create a new router
const express = require("express")
const router = express.Router()

// Handle our routes
router.get('/', function(req, res, next){
    res.render('home.ejs')
});

router.get('/about', function(req, res, next){
    res.render('about.ejs')
});

router.get('/search', function(req, res, next){
    // query database for all achievements
    let sqlquery = "SELECT * FROM achievements";

    // execute sql query
    db.query(sqlquery, (err, result) => {
        if (err) {
            // forward error to express error handler and stop
            next(err);
            return;
        }
        res.render('search.ejs', {availableAchievements: result});
    });
});

router.get('/search_result', function(req, res, next) {
    const searchTerm = req.query.search_text || '';
    // Use parameterized query to avoid SQL injection; use wildcards for partial matches
    const sql = "SELECT * FROM achievements WHERE username LIKE ?";
    const params = ['%' + searchTerm + '%'];

    db.query(sql, params, (err, rows) => {
        if (err) {
            next(err);
            return;
        }
        res.render('search_results.ejs', {
            searchTerm: searchTerm,
            results: rows
        });
    });
});

/*
router.post('/bookadded', function (req, res, next) {
    // saving data in database
    let sqlquery = "INSERT INTO books (name, price) VALUES (?, ?)";
    //Exectue sql query
    let newrecord = [req.body.name, req.body.price];
    db.query(sqlquery, newrecord, (err, result) => {
        if (err) {
            next(err);
        }
        else {
            res.send('This book is added to database, name: ' + req.body.name + ', price: £' + req.body.price);
        }
    });
});
*/
// Export the router object so index.js can access it
module.exports = router