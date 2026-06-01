const mongodb = require('../data/database');
const objectId = require('mongodb').ObjectId;

// GET ALL EXPENSES
const getAll = async (req, res) => { 
    // #Swagger.tags=['Expenses']
    try {
        const result = await mongodb.getDatabase().db().collection('expenses').find();
        const expenses = await result.toArray();
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(expenses);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch expenses: ' + err.message });
    }
};

// GET A SINGLE EXPENSE BY ID
const getSingle = async (req, res) => { 
    // #Swagger.tags=['Expenses']
    if (!objectId.isValid(req.params.id)) {
        return res.status(400).json({ error: 'Invalid ID format provided.' });
    }

    try {
        const expenseId = new objectId(req.params.id);
        const result = await mongodb.getDatabase().db().collection('expenses').find({ _id: expenseId });
        const expenses = await result.toArray();
        
        if (expenses.length === 0) {
            return res.status(404).json({ error: 'Expense not found.' });
        }
        
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(expenses[0]);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch expense: ' + err.message });
    }
};

// CREATE A NEW EXPENSE (WITH VALIDATION & TRY/CATCH)
const createExpense = async (req, res) => {
    // #Swagger.tags=['Expenses']
    const { title, amount, category, description, date } = req.body;

    // ─── DATA VALIDATION ──────────────────────────────────────────
    if (!title || !amount || !category) {
        return res.status(400).json({ error: 'Title, amount, and category are required fields.' });
    }
    if (typeof amount !== 'number' || amount <= 0) {
        return res.status(400).json({ error: 'Amount must be a positive number.' });
    }

    // ─── ERROR HANDLING VIA TRY/CATCH ──────────────────────────────
    try {
        const expense = {
            title,
            amount,
            category,
            description: description || '',
            date: date ? new Date(date) : new Date()
        };
        
        const response = await mongodb.getDatabase().db().collection('expenses').insertOne(expense);
        if (response.acknowledged) {
            // Returning 21 Created along with the new document ID is best practice
            res.status(201).json({ id: response.insertedId }); 
        } else {
            res.status(500).json({ error: 'Failed to create expense.' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error: ' + err.message });
    }
};

// UPDATE AN EXPENSE 
const updateExpense = async (req, res) => {
    // #Swagger.tags=['Expenses']
    if (!objectId.isValid(req.params.id)) {
        return res.status(400).json({ error: 'Invalid ID format provided.' });
    }

    const { title, amount, category, description, date } = req.body;

    // ─── DATA VALIDATION ──────────────────────────────────────────
    if (!title || !amount || !category) {
        return res.status(400).json({ error: 'Title, amount, and category are required fields.' });
    }
    if (typeof amount !== 'number' || amount <= 0) {
        return res.status(400).json({ error: 'Amount must be a positive number.' });
    }

    // ─── ERROR HANDLING VIA TRY/CATCH ──────────────────────────────
    try {
        const expenseId = new objectId(req.params.id);
        const expense = {
            title,
            amount,
            category,
            description: description || '',
            date: date ? new Date(date) : new Date()
        };
        
        const response = await mongodb.getDatabase().db().collection('expenses').replaceOne({ _id: expenseId }, expense);
        if (response.modifiedCount > 0) {
            res.status(200).json({ message: 'Expense updated successfully.' });
        } else {
            res.status(404).json({ error: 'Expense not found or no modifications made.' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error: ' + err.message });
    }
};

// DELETE AN EXPENSE BY ID
const deleteExpense = async (req, res) => {
    // #Swagger.tags=['Expenses']
    if (!objectId.isValid(req.params.id)) {
        return res.status(400).json({ error: 'Invalid ID format provided.' });
    }

    try {
        const expenseId = new objectId(req.params.id);
        const response = await mongodb.getDatabase().db().collection('expenses').deleteOne({ _id: expenseId });
        if (response.deletedCount > 0) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'Expense not found to delete.' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error: ' + err.message });
    }
};

module.exports = {
    getAll,
    getSingle,
    createExpense,
    updateExpense,
    deleteExpense
};