const express = require('express');
const courseController = require('../controllers/courseController');
const router = express.Router();

// Listar cursos
router.get('/', courseController.listCourses);

// Mostrar formulario para agregar curso
router.get('/add', courseController.getAddCourse);

// Procesar formulario para agregar curso
router.post('/add', courseController.postAddCourse);

// Mostrar formulario para editar curso
router.get('/edit/:id', courseController.getEditCourse);

// Procesar formulario para editar curso
router.post('/edit/:id', courseController.postEditCourse);

// Eliminar curso
router.post('/delete/:id', courseController.deleteCourse);

module.exports = router;

console.log(courseController.postEditCourse); // Debe imprimir [Function: postEditCourse]