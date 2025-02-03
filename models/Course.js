const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  instructor: { type: String, required: true },
  duration: { type: Number, required: true },
  price: { type: Number, required: true },
  payments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Payment' }], // Relación con pagos
});

module.exports = mongoose.model('Course', courseSchema);
