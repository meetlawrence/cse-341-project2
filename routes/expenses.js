const router = require('express').Router();

const expensesController = require('../controllers/expenses');

const { isAuthenticated } = require('../middleware/authenticate');

router.get('/', expensesController.getAll);
router.get('/:id', expensesController.getSingle);
router.post('/', isAuthenticated, expensesController.createExpense);
router.put('/:id', isAuthenticated, expensesController.updateExpense);
router.delete('/:id', isAuthenticated, expensesController.deleteExpense);

module.exports = router;