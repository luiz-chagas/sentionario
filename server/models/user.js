"use strict";
var env = process.env.NODE_ENV || "development";
var Sequelize = require('sequelize');
var config = require('../config/config.json')[env];
var mydb = new Sequelize(config.database, config.username, config.password, config);

module.exports = mydb.define("usuario", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nome: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false
  },
  senha: {
    type: Sequelize.STRING,
    allowNull: false
  },
  pontos: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  admin: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
    allowNull: false
  },
  avatar: {
    type: Sequelize.STRING,
    defaultValue: "anonymous",
    allowNull: false
  }
}, {
  instanceMethods: {
    toJSON: function () {
      return {
        id: this.id,
        nome: this.nome,
        email: this.email,
        pontos: this.pontos,
        admin: this.admin,
        avatar: this.avatar
      };
    }
  },
  tableName: 'usuario'
});
