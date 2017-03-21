var env = process.env.NODE_ENV || "development";
var Sequelize = require('sequelize');
var config = require('../config/config.json')[env];
var mydb = new Sequelize(config.database, config.username, config.password, config);
var User = require('./user.js');

for (let i = 0; i < 10; i++) {
  User.create({
    pontos: 10000,
    senha: 'teste',
    email: 'teste',
    nome: 'Usuario teste ' + i
  });
}
