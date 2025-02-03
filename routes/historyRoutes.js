const express = require('express');
const historyController = require('../controllers/historyController');
const router = express.Router();

// Obtener todos los registros históricos
router.get('/history', historyController.getAllHistory);

module.exports = router;