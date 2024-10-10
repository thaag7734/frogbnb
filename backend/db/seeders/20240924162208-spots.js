'use strict';

const { Spot } = require('../models');

const options = { schema: process.env.SCHEMA };

const seedData = [
  {
    ownerId: 1,
    address: '7618 Forest Park Dr',
    city: 'Shawnee',
    state: 'Kansas',
    country: 'USA',
    lat: '38.992159',
    lng: '-94.776287',
    name: 'Fake Spot 1',
    description: 'Fake Spot',
    price: 325,
  },
  {
    ownerId: 1,
    address: '3505 Spenard Rd',
    city: 'Anchorage',
    state: 'Alaska',
    country: 'USA',
    lat: '61.188339',
    lng: '-149.908256',
    name: 'Fake Spot 2',
    description: 'Fake Spot',
    price: 250,
  },
  {
    ownerId: 2,
    address: '38199 Whaleys Rd',
    city: 'Delmar',
    state: 'Delaware',
    country: 'USA',
    lat: '38.4589',
    lng: '-75.427414',
    name: 'Fake Spot 3',
    description: 'Fake Spot',
    price: 95,
  },
]

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
    await Spot.bulkCreate(seedData);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    for (const spot of seedData) {
      await Spot.destroy({ where: spot });
    }
  }
};
