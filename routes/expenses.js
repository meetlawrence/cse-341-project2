const router = require('express').Router();

const expensesController = require('../controllers/expenses');

router.get('/', expensesController.getAll);

router.get('/:id', expensesController.getSingle);

router.post('/', expensesController.createExpense);

router.put('/:id', expensesController.updateExpense);

router.delete('/:id', expensesController.deleteExpense);

module.exports = router;