'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('sugerirpalavra', {
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
      },
      updatedAt: {
        type: Sequelize.DATE
      },
      createdAt: {
        type: Sequelize.DATE
      }
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('sugerirpalavra');
  }
};
