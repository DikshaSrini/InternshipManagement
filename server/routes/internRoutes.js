const express = require('express');
const router = express.Router();
const { getInterns, updatePreferences, addIntern } = require('../controllers/internController');

router.get('/', getInterns);
router.post('/preferences', updatePreferences);
router.post('/', addIntern); 

module.exports = router;