const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  hash: { type: String, required: true, unique: true },
  issuedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Certificate', certificateSchema);

const { generateHash } = require('../config/blockchain');

certificateSchema.pre('save', function (next) {
  this.hash = generateHash(`${this.userId}-${this.courseId}-${this.issuedAt}`);
  next();
});


