const History = require('../models/History');
const User = require('../models/User');
const Course = require('../models/Course');
const Certificate = require('../models/Certificate');

// Obtener todos los registros históricos
exports.getAllHistory = async (req, res) => {
  try {
    const history = await History.find()
      .populate('userId', 'name email') // Poblar datos del usuario
      .populate('courseId', 'title instructor') // Poblar datos del curso
      .populate('certificateId', 'hash issuedAt'); // Poblar datos del certificado
    res.render('history/list', { history });
  } catch (err) {
    console.error('Error obteniendo los registros históricos:', err);
    res.status(500).send('Error interno del servidor');
  }
};

// Crear un nuevo registro histórico
exports.createHistory = async (userId, courseId, grade, certificateId) => {
  try {
    const history = new History({ userId, courseId, grade, certificateId });
    await history.save();
    return history;
  } catch (err) {
    console.error('Error creando el registro histórico:', err);
    throw err;
  }
};