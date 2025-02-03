const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Cargar variables de entorno
dotenv.config();

// Conectar a MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();

// Configurar Handlebars como motor de plantillas
app.engine('.hbs', exphbs.engine({
  extname: '.hbs', // Extensión de los archivos de plantilla
  defaultLayout: 'main', // Plantilla principal (layouts/main.hbs)
  layoutsDir: path.join(__dirname, 'views/layouts'), // Carpeta de layouts
  partialsDir: path.join(__dirname, 'views/partials'), // Carpeta de partials
}));

// Establecer Handlebars como el motor de plantillas predeterminado
app.set('view engine', '.hbs');

// Especificar la carpeta de vistas
app.set('views', path.join(__dirname, 'views'));

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

// Middleware para archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

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
app.use('/history', require('./routes/historyRoutes'));

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log('Conectado al Servidor MongoDB(R) Community.!!!');
});


