const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Registro de Nuevo Usuario
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },  // Nombre completo del usuario
  username: { type: String, required: true, unique: true }, // Nombre de usuario único
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  payments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Payment' }],
});

// Encriptar contraseña antes de guardar
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Método para comparar contraseñas
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
