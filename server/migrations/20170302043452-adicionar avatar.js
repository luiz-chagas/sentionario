'use strict';

module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.addColumn('usuario', 'avatar', {
      type: Sequelize.STRING,
      defaultValue: "anonymous",
      allowNull: false
    });
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
  },

  down: function(queryInterface, Sequelize) {
    return queryInterface.removeColumn('usuario', 'avatar');
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
