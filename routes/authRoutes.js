const express = require('express');
const passport = require('passport');
const User = require('../models/User'); // Asegúrate de importar el modelo User
const router = express.Router();

// Ruta para mostrar la vista de login (GET)
router.get('/login', (req, res) => {
  res.render('auth/login'); // ✅ Renderiza views/auth/login.hbs
});

// Ruta para mostrar la vista de registro (GET)
router.get('/register', (req, res) => {
  res.render('auth/register'); // ✅ Renderiza views/auth/register.hbs
});

// Ruta de login (POST)
router.post('/login', passport.authenticate('local'), (req, res) => {
  res.json({ message: 'Inicio de sesión exitoso', user: req.user });
});

// Ruta de registro (POST)
router.post('/register', async (req, res) => {
  const { name, username, email, password } = req.body; // Asegúrate de recibir 'name' y 'username'

  // Verificar si el nombre de usuario ya existe
  const existingUsername = await User.findOne({ username });
  if (existingUsername) {
    return res.status(400).json({ error: 'El nombre de usuario ya está en uso' });
  }

  // Verificar si el correo electrónico ya está registrado
  const existingEmail = await User.findOne({ email });
  if (existingEmail) {
    return res.status(400).json({ error: 'El correo electrónico ya está registrado' });
  }

  const user = new User({ name, username, email, password });

  try {
    await user.save();
    res.status(201).json({ message: 'Usuario registrado', user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Ruta para logout
router.post('/logout', (req, res) => {
    // Aquí puedes limpiar la sesión o las cookies
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ message: 'Error al hacer logout' });
        }
        res.status(200).json({ message: 'Logout exitoso' });
        // return res.redirect('/');
      //  res.render('home', { title: 'Inicio' }); // Asegúrate de que 'home.hbs' exista en views/
    });
});

module.exports = router;
