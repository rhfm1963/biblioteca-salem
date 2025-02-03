// controllers/certificateController.js
const Certificate = require('../models/Certificate');

// Validar un certificado
exports.validateCertificate = async (req, res) => {
  const { hash } = req.params;
  const certificate = await Certificate.findOne({ hash }).populate('userId courseId');
  if (certificate) {
    res.render('certificates/validate', { certificate });
  } else {
    res.status(404).send('Certificado no encontrado');
  }
};

// Imprimir un certificado
exports.printCertificate = async (req, res) => {
  const { id } = req.params;
  const certificate = await Certificate.findById(id).populate('userId courseId');
  if (certificate) {
    res.render('certificates/print', { certificate });
  } else {
    res.status(404).send('Certificado no encontrado');
  }
};