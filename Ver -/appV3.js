const express = require('express');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

// Cargar variables de entorno
dotenv.config();

// Conectar a MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();

// Configurar sesiones
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'secretKey', // Clave secreta para firmar la sesión
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // Cambia a true si usas HTTPS
  })
);

// Inicializar Passport
app.use(passport.initialize());
app.use(passport.session());

// Configurar estrategia local de Passport
const User = require('./models/User'); // Asegúrate de tener un modelo de usuario

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ email: username }); // Buscar usuario por email
      if (!user) return done(null, false, { message: 'Usuario no encontrado' });

      const isMatch = await bcrypt.compare(password, user.password); // Comparar contraseñas
      if (!isMatch) return done(null, false, { message: 'Contraseña incorrecta' });

      return done(null, user); // Autenticación exitosa
    } catch (err) {
      return done(err);
    }
  })
);

// Serializar y deserializar usuario
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// Middleware para archivos estáticos
app.use(express.static('public'));

// Middleware para parsear JSON y formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Pasar el usuario activo a las vistas
app.use((req, res, next) => {
  res.locals.user = req.user; // req.user es añadido por Passport
  next();
});

// Rutas
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/authRoutes'));
app.use('/courses', require('./routes/courseRoutes'));
app.use('/certificates', require('./routes/certificateRoutes'));

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log('Conectado a MongoDB(R) Community......!!')
});