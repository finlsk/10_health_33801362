// Create a new router 
/*
const express = require("express")
const router = express.Router()

// Handle our routes
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

module.exports = router*/