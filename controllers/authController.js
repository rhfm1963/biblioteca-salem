const User = require('../models/User');  // Asegúrate de que la ruta es correcta
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.getLogin = (req, res) => {
  res.render('auth/login');
};

exports.postLogin = async (req, res) => {
  const { email, username, password } = req.body;

  try {
    // Verificar si el usuario existe con el correo
    const userByEmail = await User.findOne({ email });
    if (!userByEmail) {
      return res.status(404).json({ error: 'El correo electrónico no está registrado' });
    }

    // Verificar si el usuario existe con el nombre de usuario
    const userByUsername = await User.findOne({ username });
    if (!userByUsername) {
      return res.status(404).json({ error: 'El nombre de usuario no está registrado' });
    }

    // Verificar si la contraseña es correcta
    const passwordMatch = await bcrypt.compare(password, userByEmail.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    const token = jwt.sign({ userId: userByEmail._id }, process.env.JWT_SECRET);
    res.cookie('token', token, { httpOnly: true });

    return res.status(200).json({
      message: 'Inicio de sesión exitoso',
      user: {
        username: userByEmail.username,
        email: userByEmail.email,
        role: userByEmail.role,
      },
    });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    return res.status(500).json({ error: 'Hubo un error al iniciar sesión' });
  }
};

exports.getRegister = (req, res) => {
  res.render('auth/register');
};

exports.postRegister = async (req, res) => {
  const { name, username, email, password } = req.body;

  // Verificar si el nombre de usuario ya existe
  const existingUsername = await User.findOne({ username });
  if (existingUsername) {
    return res.render('auth/register', { errorMessage: 'El nombre de usuario ya está en uso' });
  }

  // Verificar si el correo electrónico ya está registrado
  const existingEmail = await User.findOne({ email });
  if (existingEmail) {
    return res.render('auth/register', { errorMessage: 'El correo electrónico ya está registrado' });
  }

  // Encriptar la contraseña antes de guardar el usuario
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    name,
    username,
    email,
    password: hashedPassword, // Guardamos la contraseña encriptada
  });

  try {
    await user.save();

    // Omitir la contraseña antes de devolverla
    user.password = undefined;

    // Devolver un mensaje en formato JSON (útil para manejarlo en el frontend)
    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      user: {
        name: user.name,
        username: user.username,
        email: user.email,
      },
    });

    // Si prefieres redirigir (como en tu código original), puedes hacerlo
    // res.redirect('/auth/login');
  } catch (error) {
    console.error('Error al registrar el usuario:', error);
    res.status(500).send('Hubo un error al registrar el usuario.');
  }
};

exports.logout = (req, res) => {
  res.clearCookie('token');
  res.redirect('/');
};
