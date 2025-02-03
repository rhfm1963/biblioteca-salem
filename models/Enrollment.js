// models/Enrollment.js
const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Referencia al usuario
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true }, // Referencia al curso
  enrolledAt: { type: Date, default: Date.now }, // Fecha de inscripción
});

module.exports = mongoose.model('Enrollment', enrollmentSchema);