const mongodb = require('../data/database');
const objectId = require('mongodb').ObjectId;

// GET ALL USERS
const getAll = async (req, res) => { 
    // #Swagger.tags=['Users']
    try {
        const result = await mongodb.getDatabase().db().collection('users').find();
        const users = await result.toArray();
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch users: ' + err.message });
    }
};

// GET A SINGLE USER BY ID
const getSingle = async (req, res) => { 
    // #Swagger.tags=['Users']
    if (!objectId.isValid(req.params.id)) {
        return res.status(400).json({ error: 'Invalid ID format provided.' });
    }

    try {
        const userId = new objectId(req.params.id);
        const result = await mongodb.getDatabase().db().collection('users').find({ _id: userId });
        const users = await result.toArray();
        
        if (users.length === 0) {
            return res.status(404).json({ error: 'User not found.' });
        }
        
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(users[0]);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch user: ' + err.message });
    }
};

// CREATE A NEW USER
const createUser = async (req, res) => {
    // #Swagger.tags=['Users']
    const { firstName, lastName, email, phoneNumber } = req.body;

    // ─── DATA VALIDATION ──────────────────────────────────────────────────
    if (!firstName || !lastName || !email || !phoneNumber) {
        return res.status(400).json({ error: 'First name, last name, email, and phone number are all required.' });
    }
    if (!email.includes('@')) {
        return res.status(400).json({ error: 'Please provide a valid email address.' });
    }

    // ─── TRY/CATCH ERROR HANDLING ─────────────────────────────────────────
    try {
        const user = {
            firstName,
            lastName,
            email,
            phoneNumber
        };
        
        const response = await mongodb.getDatabase().db().collection('users').insertOne(user);
        if (response.acknowledged) {
            res.status(201).json({ id: response.insertedId });
        } else {
            res.status(500).json({ error: 'Failed to create user.' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error: ' + err.message });
    }
};

// UPDATE An EXISTING USER
const updateUser = async (req, res) => {
    // #Swagger.tags=['Users']
    if (!objectId.isValid(req.params.id)) {
        return res.status(400).json({ error: 'Invalid ID format provided.' });
    }

    const { firstName, lastName, email, phoneNumber } = req.body;

    // ─── DATA VALIDATION ──────────────────────────────────────────────────
    if (!firstName || !lastName || !email || !phoneNumber) {
        return res.status(400).json({ error: 'First name, last name, email, and phone number are all required.' });
    }

    // ─── TRY/CATCH ERROR HANDLING ─────────────────────────────────────────
    try {
        const userId = new objectId(req.params.id);
        const user = {
            firstName,
            lastName,
            email,
            phoneNumber
        };
        
        const response = await mongodb.getDatabase().db().collection('users').replaceOne({ _id: userId }, user);
        if (response.modifiedCount > 0) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'User not found or no modifications made.' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error: ' + err.message });
    }
};

// DELETE A USER BY ID
const deleteUser = async (req, res) => {
    // #Swagger.tags=['Users']
    if (!objectId.isValid(req.params.id)) {
        return res.status(400).json({ error: 'Invalid ID format provided.' });
    }

    try {
        const userId = new objectId(req.params.id);
        const response = await mongodb.getDatabase().db().collection('users').deleteOne({ _id: userId });
        if (response.deletedCount > 0) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'User not found to delete.' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error: ' + err.message });
    }
};

module.exports = {
    getAll,
    getSingle,
    createUser,
    updateUser,
    deleteUser
};