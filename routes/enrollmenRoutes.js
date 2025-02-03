const express = require('express');
const enrollmentController = require('../controllers/enrollmentController');
const router = express.Router();

// Mostrar confirmación de inscripción
router.get('/enroll/confirm', enrollmentController.getEnrollConfirm);

module.exports = router;