'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.createTable('likes', {
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
      like: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE
      },
      createdAt: {
        type: Sequelize.DATE
      }
    });
    queryInterface.addColumn('word', 'likePos', {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      allowNull: false
    });
    return queryInterface.addColumn('word', 'likeNeg', {
      type: Sequelize.INTEGER,
      defaultValue: 0,
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
    queryInterface.dropTable('likes');
    queryInterface.removeColumn('word', 'likePos');
    return queryInterface.removeColumn('word', 'likeNeg');
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
