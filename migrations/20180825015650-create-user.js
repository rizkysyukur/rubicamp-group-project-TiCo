'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      email: {
        type: Sequelize.STRING
      },
      pass: {
        type: Sequelize.STRING
      },
      fbid: {
        type: Sequelize.STRING
      },
      fbtoken: {
        type: Sequelize.STRING
      },
      fbemail: {
        type: Sequelize.STRING
      },
      fbname: {
        type: Sequelize.STRING
      },
      twid: {
        type: Sequelize.STRING
      },
      twtoken: {
        type: Sequelize.STRING
      },
      twemail: {
        type: Sequelize.STRING
      },
      twname: {
        type: Sequelize.STRING
      },
      googleid: {
        type: Sequelize.STRING
      },
      googletoken: {
        type: Sequelize.STRING
      },
      googleemail: {
        type: Sequelize.STRING
      },
      googlename: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Users');
  }
};
