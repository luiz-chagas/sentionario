'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.changeColumn(
      'metadiaria',
      'dia', {
        type: Sequelize.INTEGER,
        allowNull: false
      }
    );
    queryInterface.changeColumn(
      'metadiaria',
      'mes', {
        type: Sequelize.INTEGER,
        allowNull: false
      }
    );
    queryInterface.changeColumn(
      'metadiaria',
      'ano', {
        type: Sequelize.INTEGER,
        allowNull: false
      }
    );
  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
