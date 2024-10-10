'use strict';

const { ReviewImage } = require('../models');

const seedData = [
  {
    reviewId: 1,
    url: 'https://www.startpage.com/av/proxy-image?piurl=http%3A%2F%2Fgamehag.com%2Fimg%2Fnews%2F102914_purble-place.jpg&sp=1727205074Tbb47d045cf0a039f78ff7765f14761ff352cc6177e7214009b00aa7a88e68bdf',
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
    await ReviewImage.bulkCreate(seedData);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    for (const img of seedData) {
      await ReviewImage.destroy({ where: img });
    }
  }
};
