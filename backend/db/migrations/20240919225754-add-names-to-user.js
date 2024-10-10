'use strict';

let options = { schema: process.env.SCHEMA };

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn(
      { tableName: 'Users', schema: options.schema },
      'firstName',
      {
        type: Sequelize.STRING(30),
        allowNull: false,
        validate: { len: [1, 30] },
      }
    );

    await queryInterface.addColumn(
      { tableName: 'Users', schema: options.schema },
      'lastName',
      {
        type: Sequelize.STRING(30),
        allowNull: false,
        validate: { len: [1, 30] },
      }
    );
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn(
      { tableName: 'Users', schema: options.schema },
      'firstName'
    );
    await queryInterface.removeColumn(
      { tableName: 'Users', schema: options.schema },
      'lastName'
    );
  }
};
