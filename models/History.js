const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Referencia al usuario
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true }, // Referencia al curso
  grade: { type: Number, min: 0, max: 100 }, // Calificación (opcional)
  certificateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Certificate' }, // Referencia al certificado (opcional)
  date: { type: Date, default: Date.now }, // Fecha del registro
});

module.exports = mongoose.model('History', historySchema);