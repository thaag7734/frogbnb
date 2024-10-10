'use strict';

const { SpotImage } = require('../models');

const options = { schema: process.env.SCHEMA };

const seedData = [
  {
    spotId: 1,
    url: 'https://www.startpage.com/av/proxy-image?piurl=http%3A%2F%2Fwww.clipartbest.com%2Fcliparts%2F9c4%2FeMB%2F9c4eMB8zi.jpeg&sp=1727205940Tfce6c07f3f095fc7861a49a6a0a729de84021130a8f500e55eaa149c4e9af78d',
    preview: true,
  },
  {
    spotId: 2,
    url: 'https://www.startpage.com/av/proxy-image?piurl=http%3A%2F%2Fwww.clipartbest.com%2Fcliparts%2F9ip%2F6bk%2F9ip6bkEkT.jpg&sp=1727205940T4f75e1a90bf891692315a07715b5320c5efe5f945d3c1b57ff1ade47a8969f46',
    preview: true,
  },
  {
    spotId: 3,
    url: 'https://www.startpage.com/av/proxy-image?piurl=http%3A%2F%2Fimg0.joyreactor.com%2Fpics%2Fpost%2Ffull%2Ffunny-pictures-house-6552230.jpeg&sp=1727206098Tc0d50a5e32fc2037ef29e7d1599614fa87db758b6c9c64bfc1d610e2968ea57a',
    preview: true,
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
    await SpotImage.bulkCreate(seedData);
  },

  async down (queryInterface, Sequelize) {
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
