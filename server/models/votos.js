"use strict";
var env = process.env.NODE_ENV || "development";
var Sequelize = require('sequelize');
var config = require('../config/config.json')[env];
var mydb = new Sequelize(config.database, config.username, config.password, config);

module.exports = mydb.define("votos", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      id_usuario: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      id_palavra: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      voto: {
        type: Sequelize.INTEGER,
        allowNull: false
      }
  }, {
    tableName: 'votos'
  });
