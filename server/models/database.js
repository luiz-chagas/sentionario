var env = process.env.NODE_ENV || "development";
var Sequelize = require('sequelize');
var config = require('../config/config.json')[env];
var mydb = new Sequelize(config.database, config.username, config.password, config);
var Palavra = require('./palavra.js');
var Voto = require('./votos.js');
var User = require('./user.js');

Palavra.sync();
User.sync();
Voto.sync();
