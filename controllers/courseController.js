const Course = require('../models/Course');
const History = require('../models/History');
const Certificate = require('../models/Certificate');

// Listar cursos
exports.listCourses = async (req, res) => {
  try {
    const courses = await Course.find().lean();
    res.render('courses/list', { courses });
  } catch (err) {
    console.error('Error obteniendo los cursos:', err);
    res.status(500).send('Error interno del servidor');
  }
};

// Mostrar formulario para agregar curso
exports.getAddCourse = (req, res) => {
  res.render('courses/add');
};

// Procesar formulario para agregar curso
exports.postAddCourse = async (req, res) => {
  try {
    const { title, description, instructor, duration, price } = req.body;
    const course = new Course({ title, description, instructor, duration, price });
    await course.save();
    res.redirect('/courses');
  } catch (err) {
    console.error('Error agregando el curso:', err);
    res.status(500).send('Error interno del servidor');
  }
};

// Mostrar formulario para editar curso
// console.log('postEditCourse está siendo llamada'); // Agrega esto al inicio de la función
exports.getEditCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    res.render('courses/edit', { course });
  } catch (err) {
    console.error('Error obteniendo el curso:', err);
    res.status(500).send('Error interno del servidor');
  }
};

// Procesar formulario para editar curso
exports.postEditCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, instructor, duration, price } = req.body;
    await Course.findByIdAndUpdate(id, { title, description, instructor, duration, price });
    res.redirect('/courses');
  } catch (err) {
    console.error('Error actualizando el curso:', err);
    res.status(500).send('Error interno del servidor');
  }
};

// Eliminar curso
exports.deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    await Course.findByIdAndDelete(id);
    res.redirect('/courses');
  } catch (err) {
    console.error('Error eliminando el curso:', err);
    res.status(500).send('Error interno del servidor');
  }
};

// Procesar la finalización de un curso
exports.completeCourse = async (req, res) => {
    const { userId, courseId, grade } = req.body;
  
    try {
      // Crear un certificado
      const certificate = new Certificate({
        userId,
        courseId,
        hash: generateCertificateHash(userId, courseId), // Función para generar un hash único
      });
      await certificate.save();
  
      // Crear un registro histórico
      await History.createHistory(userId, courseId, grade, certificate._id);
  
      res.redirect('/courses');
    } catch (err) {
      console.error('Error completando el curso:', err);
      res.status(500).send('Error interno del servidor');
    }
  };