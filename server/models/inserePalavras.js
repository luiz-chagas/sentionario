var env = process.env.NODE_ENV || "development";
var Sequelize = require('sequelize');
var config = require('../config/config.json')[env];
var mydb = new Sequelize(config.database, config.username, config.password, config);
var Palavra = require('./palavra.js');

var palavras = require('../../palavras.json');

for (palavra in palavras) {
  Palavra.create({
    nome: palavras[palavra].palavra
  });
}
