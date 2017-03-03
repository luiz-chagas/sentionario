'use strict';

module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('metadiaria', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      id_usuario: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      dia: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Date.now()
      },
      votos: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      concluida: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }
    });
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
  },

  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('metadiaria');
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
