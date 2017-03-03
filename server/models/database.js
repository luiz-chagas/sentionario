var env = process.env.NODE_ENV || "development";
var Sequelize = require('sequelize');
var config = require('../config/config.json')[env];
var mydb = new Sequelize(config.database, config.username, config.password, config);
var Palavra = require('./palavra.js');
var Voto = require('./votos.js');
var User = require('./user.js');
var MetaDiaria = require('./metaDiaria.js')

Palavra.sync();
User.sync();
Voto.sync();
MetaDiaria.sync();
