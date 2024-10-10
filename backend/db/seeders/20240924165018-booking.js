'use strict';

const { Booking } = require('../models');

const seedData = [
  {
    spotId: 1,
    userId: 3,
    startDate: '2024-09-24T00:00:00Z',
    endDate: '2024-09-26T00:00:00Z',
  },
  {
    spotId: 2,
    userId: 1,
    startDate: '2024-04-13T00:00:00Z',
    endDate: '2024-04-16T00:00:00Z',
  },
  {
    spotId: 3,
    userId: 2,
    startDate: '2024-11-24T00:00:00Z',
    endDate: '2024-11-29T00:00:00Z',
  },
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await Booking.bulkCreate(seedData);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    for (const booking of seedData) {
      await Booking.destroy({ where: booking });
    }
  }
};
