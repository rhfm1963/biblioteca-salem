const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId, // Relación con el modelo User
    ref: 'User', // Referencia al modelo User
    required: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId, // Relación con el modelo Course
    ref: 'Course', // Referencia al modelo Course
    required: true,
  },
  amount: {
    type: Number, // Monto del pago
    required: true,
  },
  paymentDate: {
    type: Date, // Fecha del pago
    default: Date.now, // Fecha actual por defecto
  },
  status: {
    type: String, // Estado del pago (por ejemplo, "completed", "pending", "failed")
    enum: ['completed', 'pending', 'failed'], // Valores permitidos
    default: 'pending', // Valor por defecto
  },
});

module.exports = mongoose.model('Payment', paymentSchema);