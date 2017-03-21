var env = process.env.NODE_ENV || "development";
var Sequelize = require('sequelize');
var config = require('../config/config.json')[env];
var mydb = new Sequelize(config.database, config.username, config.password, config);
var User = require('./user.js');

User.findAll({
  where: {
    pontos: 10000
  }
}).then((users) => {
  users.forEach(function (user) {
    user.destroy();
  });
})
