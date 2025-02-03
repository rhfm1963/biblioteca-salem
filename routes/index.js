const express = require('express');
const router = express.Router();

// Ruta principal
router.get('/', (req, res) => {
  res.render('home', { title: 'Inicio' }); // Asegúrate de que 'home.hbs' exista en views/
});

module.exports = router;