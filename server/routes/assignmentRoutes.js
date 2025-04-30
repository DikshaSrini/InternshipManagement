const express = require('express');
const router = express.Router();
const { getAssignments, saveAssignments, saveAutoAssignments, getAssignmentsForExport } = require('../controllers/assignmentController');

router.get('/', getAssignments);
router.post('/', saveAssignments);
router.post('/autoAssignments', saveAutoAssignments);
router.get('/export', getAssignmentsForExport);

module.exports = router;
