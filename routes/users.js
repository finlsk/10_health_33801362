// Create a new router
const express = require("express")
const router = express.Router()
const redirectLogin = (req, res, next) => {
    if (!req.session.userId) {
        res.redirect('./login'); // redirect to login page
    } else {
        next();
    }
};

router.get('/register', function (req, res, next) {
    res.render('register.ejs')
})


router.post('/registered', function (req, res, next) {
    // saving data in database                                                                            
    const bcrypt = require('bcrypt');
    const saltRounds = 10;
    const plainPassword = req.body.password;
    bcrypt.hash(plainPassword, saltRounds, function(err, hashedPassword) {
        if (err) {
            next(err);
        } else {
            // Store hashed password in your database.
            let sqlquery = "INSERT INTO register (username, firstName, lastName, email, hashedPassword) VALUES (?, ?, ?, ?, ?)";
            //Exectue sql query
            let newrecord = [req.body.username, req.body.first, req.body.last, req.body.email, hashedPassword];
            db.query(sqlquery, newrecord, (err, result) => {
                if (err) {
                    next(err);
                }
                else {
                    res.send(' Hello '+ req.body.first + ' '+ req.body.last +', you are now registered!' + '<a href="/users/login"> Login here!</a>');
                }
            });
        }
    });
}); 

router.get('/add_achievement', redirectLogin, function (req, res, next) {
    res.render('add_data.ejs')
});

router.post('/achievement_added', redirectLogin, function (req, res, next) {
    // saving data in database
    let sqlquery = "INSERT INTO achievements (username, distrun, speed) VALUES (?, ?, ?)";
    //Exectue sql query
    let newrecord = [req.session.userId, req.body.dist, req.body.time];
    db.query(sqlquery, newrecord, (err, result) => {
        if (err) {
            next(err);
        }
        else {
            res.send('This achievement is added to database for user ' + req.session.userId + ', distance: ' + req.body.dist + ', time: ' + req.body.time + '<br><a href="/users/add_achievement">Add another achievement</a> or <a href="/">Go to Home</a>');
        }
    });
});

router.get('/login', function (req, res, next) {
    res.render('login.ejs')
})

router.post('/loggedin', function (req, res, next) {
    const bcrypt = require('bcrypt');
    const plainPassword = req.body.password;
    const username = req.body.username;
    
    // Query database for the user's hashed password
    let sqlquery = "SELECT hashedPassword FROM register WHERE username = ?";
    let querydata = [username];
    
    db.query(sqlquery, querydata, (err, result) => {
        if (err) {
            next(err);
        } else if (result.length === 0) {
            // Username not found
            res.send("Username not found");
        } else {
            // Compare the provided password with the stored hash (or a legacy literal)
            const stored = result[0].hashedPassword || '';

            // Quick special-case: accept the literal legacy password 'smiths' if stored as such
            if (stored === 'smiths') {
                if (plainPassword === 'smiths') {
                    // Re-hash and update DB in background for future logins
                    const saltRounds = 10;
                    bcrypt.hash(plainPassword, saltRounds, (hashErr, newHash) => {
                        if (!hashErr) {
                            db.query("UPDATE register SET hashedPassword = ? WHERE username = ?", [newHash, username], (uErr) => {
                                if (uErr) console.error('Failed to update legacy password to hash for user', username, uErr);
                            });
                        } else {
                            console.error('Failed to hash legacy password for user', username, hashErr);
                        }
                    });

                    req.session.userId = username;
                    req.session.username = username;
                    return res.redirect('/users/add_achievement');
                } else {
                    return res.send("Incorrect password");
                }
            }

            // Otherwise treat stored value as a bcrypt hash
            const storedHash = stored;
            bcrypt.compare(plainPassword, storedHash, function(err, isMatch) {
                if (err) {
                    next(err);
                } else if (isMatch) {
                    // Passwords match so login successful
                    // Save username in session (userId used by redirectLogin) and redirect to add achievement
                    req.session.userId = username;
                    req.session.username = username;
                    return res.send('Successfully logged in! <a href="/users/add_achievement">Add Achievement</a> or <a href="/">Go to Home</a>');
                } else {
                    // Passwords don't match
                    res.send("Incorrect password");
                }
            });
        }
    });
});

// Logout route destroys the session and redirects to the login page
router.get('/logout', function(req, res, next) {
    req.session.destroy(function(err) {
        if (err) { 
            return next(err); 
        }
        res.clearCookie('connect.sid');
        res.send('Successfully logged out!' + '<a href="/"> Back to home</a>');
    });
});

module.exports = router; 