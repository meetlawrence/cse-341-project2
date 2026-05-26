const mongodb = require('../data/database');
const objectId = require('mongodb').ObjectId;



const getAll = async (req, res) => { 
    // #Swagger.tags=['Expenses']
    const result = await mongodb.getDatabase().db().collection('expenses').find();
    result.toArray().then((expenses) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(expenses);
    }).catch((err) => {
        res.status(500).json({ error: 'Failed to fetch expenses' });
    });
};

const getSingle = async (req, res) => { 
    // #Swagger.tags=['Expenses']
    const expenseId = new objectId(req.params.id);
    const result = await mongodb.getDatabase().db().collection('expenses').find({ _id: expenseId });
    result.toArray().then((expenses) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(expenses[0]);
    }).catch((err) => {
        res.status(500).json({ error: 'Failed to fetch expense' });
    });
};

const createExpense = async (req, res) => {
    // #Swagger.tags=['Expenses']
    const expense = {
        title: req.body.title,
        amount: req.body.amount,
        category: req.body.category,
        description: req.body.description,
        date: req.body.date ? new Date(req.body.date) : new Date()
    };
    const response = await mongodb.getDatabase().db().collection('expenses').insertOne(expense);
    if (response.acknowledged) {
        res.status(204).send();
    } else {
        res.status(500).json({ error: 'Failed to create expense' });
    }
};

const updateExpense = async (req, res) => {
    // #Swagger.tags=['Expenses']
    const expenseId = new objectId(req.params.id);
    const expense = {
        title: req.body.title,
        amount: req.body.amount,
        category: req.body.category,
        description: req.body.description,
        date: req.body.date ? new Date(req.body.date) : new Date()
    };
    const response = await mongodb.getDatabase().db().collection('expenses').replaceOne({ _id: expenseId }, expense);
    if (response.modifiedCount > 0) {
        res.status(204).send();
    } else {
        res.status(500).json({ error: 'Failed to update expense' });
    }
};

const deleteExpense = async (req, res) => {
        // #Swagger.tags=['Expenses']
    const expenseId = new objectId(req.params.id);
    const response = await mongodb.getDatabase().db().collection('expenses').deleteOne({ _id: expenseId });
    if (response.deletedCount > 0) {
        res.status(204).send();
    } else {
        res.status(500).json({ error: 'Failed to delete expense' });
    }
};

module.exports = {
    getAll,
    getSingle,
    createExpense,
    updateExpense,
    deleteExpense
};