'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn('usuario', 'task_conquista', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false
    });
    return queryInterface.addColumn('usuario', 'task_ranking', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false
    });
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('usuario', 'task_conquista');
    return queryInterface.removeColumn('usuario', 'task_ranking');
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
