var express = require('express');
var path = require('path');
var expressSession = require('express-session');
var favicon = require('favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var apiController = require('./routes/api-controller.js');
var passport = require('./middleware/auth.js');
var redis = require('redis');
var redisClient = redis.createClient();
var sequelize = require('sequelize');
var RedisStore = require('connect-redis')(expressSession);

// Configurando servidor

var app = express();
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../client')));
app.sessionStorage = new RedisStore({
  host: 'localhost',
  port: 6379,
  client: redisClient
});
app.use(expressSession({
  secret: 'meu segredo',
  store: app.sessionStorage,
  resave: false,
  saveUninitialized: false
}));

// Configurando passport

app.use(passport.initialize());
app.use(passport.session());

// Configurando rotas

app.use('/api', apiController);

app.use('*', function(req, res, next) {
  var indexFile = path.resolve(__dirname, '..', 'client', 'index.html');
  res.sendFile(indexFile);
})

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
});

module.exports = app;
