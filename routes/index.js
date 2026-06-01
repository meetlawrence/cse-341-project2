const router = require('express').Router();
const passport = require('passport');

router.use('/', require('./swagger'));


router.use('/expenses', require('./expenses'));
router.use('/users', require('./users'));

router.get('/login', passport.authenticate('github'), (req, res) => { });

router.get('/logout', (req, res, next) => {
    // Tell Passport to log out
    req.logout((err) => {
        if (err) { return next(err); }
        
        // Destroy the Express Session completely to clear req.session.user
        req.session.destroy((err) => {
            if (err) {
                console.log("Error destroying session:", err);
            }
            res.clearCookie('connect.sid'); // Clear the session cookie from the browser
            res.redirect('/'); 
        });
    });
});

module.exports = router;