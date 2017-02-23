"use strict";
var env = process.env.NODE_ENV || "development";
var Sequelize = require('sequelize');
var config = require('../config/config.json')[env];
var mydb = new Sequelize(config.database, config.username, config.password, config);

module.exports = mydb.define("palavra", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      nome: {
        type: Sequelize.STRING,
        allowNull: false
      },
      total:{
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      qtdVotos: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      votos1: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false
      },
      votos2: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false
      },
      votos3: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false
      },
      votos4: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false
      },
      votos5: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false
      },
      votos6: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false
      },
      votos7: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false
      },
      votos8: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false
      },
      votos9: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false
      }
  }, {
    tableName: 'word'
  });
