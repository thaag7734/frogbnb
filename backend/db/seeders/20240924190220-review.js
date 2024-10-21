'use strict';

const { Review } = require('../models');

const seedData = [
  {
    spotId: 2,
    userId: 1,
    review: 'Great spot ribbit! I love the bugs here and the lilypads are very comfy.',
    stars: 4
  }
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
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

  async down(queryInterface, Sequelize) {
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
