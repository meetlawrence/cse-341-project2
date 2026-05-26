const router = require('express').Router();

router.use('/', require('./swagger'));

router.get('/', (req, res) => {
    res.send('Welcome to the API!');
});

router.use('/expenses', require('./expenses'));

module.exports = router;