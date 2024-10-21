'use strict';

const { SpotImage } = require('../models');

const seedData = [
  {
    spotId: 1,
    url: 'https://i.ibb.co/VTVBbfx/lucky-lilypad.jpg',
    preview: true,
  },
  {
    spotId: 1,
    url: 'https://i.ibb.co/FJyk92c/lp9.jpg',
    preview: false,
  },
  {
    spotId: 1,
    url: 'https://i.ibb.co/R2P3g2C/lp8.jpg',
    preview: false,
  },
  {
    spotId: 1,
    url: 'https://i.ibb.co/myHLQM7/lp7.jpg',
    preview: false,
  },
  {
    spotId: 1,
    url: 'https://i.ibb.co/0rnWFdc/lp6.jpg',
    preview: false,
  },
  {
    spotId: 2,
    url: 'https://i.ibb.co/PZqZf2M/lp1.jpg',
    preview: true,
  },
  {
    spotId: 2,
    url: 'https://i.ibb.co/6myZDXS/lp2.jpg',
    preview: false,
  },
  {
    spotId: 2,
    url: 'https://i.ibb.co/Rb41Y4n/lp5.jpg',
    preview: false,
  },
  {
    spotId: 2,
    url: 'https://i.ibb.co/QP1F6C3/lp4.jpg',
    preview: false,
  },
  {
    spotId: 2,
    url: 'https://i.ibb.co/0J7bv8Q/lp3.jpg',
    preview: false,
  },
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
    await SpotImage.bulkCreate(seedData);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    for (const img of seedData) {
      await SpotImage.destroy({ where: img });
    }
  }
};
