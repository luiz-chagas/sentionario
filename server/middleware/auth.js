var User = require('../models/user.js');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'senha'
  },function(email, senha, done){
  User.findOne({
    where: {
      'email': email
    }
  }).then(function(user, err){
    if (err) { return done(err); }
    if(!user) {
      return done(null, false, { message: 'Dados incorretos.' })
    }
    if(senha != user.senha){
      return done(null, false, { message: 'Dados incorretos.' })
    }
    return done(null, user)
  })
}));

passport.serializeUser(function(user, done){
    done(null, user.id);
})

passport.deserializeUser(function(id, done) {
  User.findById(id).then(function (user) {
    done(null, user);
  });
});

module.exports = passport;
