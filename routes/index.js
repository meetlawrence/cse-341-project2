const router = require('express').Router();
const passport = require('passport');

router.use('/', require('./swagger'));


router.use('/expenses', require('./expenses'));
router.use('/users', require('./users'));

router.get('/login', passport.authenticate('github'), (req, res) => { });

router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.session.destroy((destroyErr) => {
            if (destroyErr) {
                return next(destroyErr);
            }
            res.redirect('/');
        });
    });
});

module.exports = router;