// config/passportConfig.js
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User'); // Asegúrate de importar tu modelo de usuario

// Estrategia local
passport.use(
  new LocalStrategy(
    {
      usernameField: 'email', // Campo del formulario para el email
      passwordField: 'password', // Campo del formulario para la contraseña
    },
    async (email, password, done) => {
      try {
        // Busca al usuario por su email
        const user = await User.findOne({ email });
        if (!user) {
          return done(null, false, { message: 'Usuario no encontrado' });
        }

        // Verifica la contraseña
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
          return done(null, false, { message: 'Contraseña incorrecta' });
        }

        // Si todo está bien, retorna el usuario
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

// Serializar y deserializar usuario
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

module.exports = passport;