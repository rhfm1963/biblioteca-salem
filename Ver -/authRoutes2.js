const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Mostrar formulario de registro
router.get('/register', (req, res) => {
  res.render('auth/register');
});

// Procesar registro
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const user = new User({ name, email, password });
    await user.save();
    res.redirect('/auth/login');
  } catch (err) {
    console.error('Error registrando usuario:', err);
    res.status(500).send('Error interno del servidor');
  }
});

// Mostrar formulario de inicio de sesión
router.get('/login', (req, res) => {
  res.render('auth/login');
});

// Procesar inicio de sesión
router.post('/login', passport.authenticate('local', {
  successRedirect: '/', // Redirigir a la página principal después del login
  failureRedirect: '/auth/login', // Redirigir al login si falla
  failureFlash: true, // Opcional: Mostrar mensajes de error
}));

// Cerrar sesión
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error('Error cerrando sesión:', err);
      return res.status(500).send('Error interno del servidor');
    }
    res.redirect('/');
  });
});

module.exports = router;