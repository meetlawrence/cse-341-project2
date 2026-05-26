const router = require('express').Router();

router.use('/', require('./swagger'));

router.get('/', (req, res) => {
    res.send('Welcome to The Personal Expense Tracker API!');
});

router.use('/expenses', require('./expenses'));
router.use('/users', require('./users'));

module.exports = router;