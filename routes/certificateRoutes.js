// routes/certificateRoutes.js
const express = require('express');
const certificateController = require('../controllers/certificateController');
const router = express.Router();

// Ruta para validar un certificado
router.get('/validate/:hash', certificateController.validateCertificate);

// Ruta para imprimir un certificado
router.get('/print/:id', certificateController.printCertificate);

module.exports = router;