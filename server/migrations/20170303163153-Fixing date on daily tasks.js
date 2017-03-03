'use strict';

module.exports = {
  up: function(queryInterface, Sequelize) {
    queryInterface.removeColumn("metadiaria", "dia");
    queryInterface.addColumn("metadiaria", "dia", {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: new Date().getDate()
    });
    queryInterface.addColumn("metadiaria", "mes", {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: new Date().getMonth()
    });
    queryInterface.addColumn("metadiaria", "ano", {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: new Date().getYear()
    });

    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
  },

  down: function(queryInterface, Sequelize) {
    queryInterface.removeColumn("metadiaria", "dia");
    queryInterface.removeColumn("metadiaria", "mes");
    queryInterface.removeColumn("metadiaria", "ano");
    queryInterface.addColumn("metadiaria", "dia", {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Date.now()
    });
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
