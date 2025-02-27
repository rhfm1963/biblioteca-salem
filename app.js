const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const passportConfig = require('./config/passportConfig');
const paymentRoutes = require('./routes/paymentRoutes');

// Cargar variables de entorno
dotenv.config();

// Conectar a MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 5000, // Tiempo de espera para encontrar un servidor
})
  .then(() => console.log('✅ Conectado a MongoDB Atlas'))
  .catch(err => console.error('❌ Error al conectar con MongoDB Atlas:', err));

const app = express();

// Configurar Handlebars como motor de plantillas
app.engine('.hbs', exphbs.engine({
  extname: '.hbs', // Extensión de los archivos de plantilla
  defaultLayout: 'main', // Plantilla principal (layouts/main.hbs)
  layoutsDir: path.join(__dirname, 'views/layouts'), // Carpeta de layouts
  partialsDir: path.join(__dirname, 'views/partials'), // Carpeta de partials
  runtimeOptions: {
    allowProtoPropertiesByDefault: true // Permitir acceso a propiedades del prototipo
  }
}));

app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'views'));

// Configuración de sesión
app.use(session({
  secret: process.env.SESSION_SECRET || 'secretKey', // Clave secreta para firmar la sesión
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }, // Cambia a true si usas HTTPS
}));

// Inicializar Passport
app.use(passport.initialize());
app.use(passport.session());

// Middleware para archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para parsear JSON y formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Pasar el usuario activo a las vistas
app.use((req, res, next) => {
  res.locals.user = req.user || null; // Asegúrate de que req.user sea null si no está autenticado
  next();
});

// Rutas
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/authRoutes')); // Rutas de autenticación
app.use('/courses', require('./routes/courseRoutes'));
app.use('/certificates', require('./routes/certificateRoutes'));
app.use('/history', require('./routes/historyRoutes'));
app.use('/payments', paymentRoutes);

// Ruta para mostrar la vista login
app.get('/auth/login', (req, res) => {
  res.render('auth/login'); // Renderiza login.hbs en la carpeta views/auth
});

// Ruta para el Logout
app.get('/auth/logout', (req, res) => {
  console.log('Solicitud de logout recibida');
  req.logout((err) => {
      if (err) {
          console.error('Error al hacer logout:', err);
          return res.status(500).send('Error al hacer logout');
      }
      console.log('Logout exitoso');
      // res.redirect('/auth/login'); // Redirige al usuario al login
      res.redirect('/'); // Redirige al usuario al inicio
  });
});


// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
