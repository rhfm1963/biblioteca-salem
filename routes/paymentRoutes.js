const express = require('express');
const { createPayment, getPaymentsByUser, getPaymentsByCourse } = require('../controllers/paymentController');
const router = express.Router();

// Crear un pago
router.post('/', createPayment);

// Obtener pagos de un usuario
router.get('/user/:userId', getPaymentsByUser);

// Obtener pagos de un curso
router.get('/course/:courseId', getPaymentsByCourse);

module.exports = router;
