"use strict";
var env = process.env.NODE_ENV || "development";
var Sequelize = require('sequelize');
var config = require('../config/config.json')[env];
var mydb = new Sequelize(config.database, config.username, config.password, config);

module.exports = mydb.define("sugerirpalavra", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_usuario: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  palavra: {
    type: Sequelize.STRING,
    allowNull: false
  },
  aceita: {
    type: Sequelize.BOOLEAN,
    allowNull: true
  },
  id_avaliador: {
    type: Sequelize.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'sugerirpalavra'
});
