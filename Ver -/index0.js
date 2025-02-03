const express = require('express');
const router = express.Router();

// Ruta principal
router.get('/', (req, res) => {
  res.render('home'); // Renderiza la vista "home.hbs"
});

module.exports = router;