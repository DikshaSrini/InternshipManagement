const express = require('express');
const router = express.Router();
const { getInterns, updatePreferences, addIntern, deleteIntern, updateIntern } = require('../controllers/internController');

// GET all interns
router.get('/', getInterns);

// POST: Update intern preferences
router.post('/preferences', updatePreferences);

// POST: Add a new intern
router.post('/', addIntern);

// DELETE: Remove an intern by ID
router.delete('/:internId', deleteIntern);  // Route for deleting an intern

// PUT: Update intern details by ID
router.put('/:internId', updateIntern);  // Route for updating an intern

module.exports = router;
