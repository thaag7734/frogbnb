'use strict';

const { Review } = require('../models');

const seedData = [
  {
    spotId: 2,
    userId: 1,
    review: 'Lorem ipsum odor amet, consectetuer adipiscing elit. Nec egestas cras taciti aenean ligula ex turpis amet vulputate sem sollicitudin scelerisque justo pretium nibh scelerisque fermentum lectus arcu.',
    stars: 4
  }
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
    await Review.bulkCreate(seedData);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    for (const review of seedData) {
      await Review.destroy({ where: review });
    }
  }
};
