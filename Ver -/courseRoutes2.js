const express = require('express');
const courseController = require('../controllers/courseController');
const router = express.Router();
const { ensureAuthenticated } = require('../middleware/auth'); // Middleware de autenticación

// Proteger rutas
router.get('/', ensureAuthenticated, courseController.listCourses);
router.get('/add', ensureAuthenticated, courseController.getAddCourse);
router.post('/add', ensureAuthenticated, courseController.postAddCourse);

module.exports = router;console.log(courseController.postEditCourse); // Debe imprimir [Function: postEditCourse]