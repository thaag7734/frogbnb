'use strict';

const { Spot } = require('../models');

const options = { schema: process.env.SCHEMA };

const seedData = [
  {
    ownerId: 1,
    address: '7618 Ribbit Rd',
    city: 'Croaksville',
    state: 'Amphibiana',
    country: 'The Ribbit Realm',
    lat: '38.992159',
    lng: '-94.776287',
    name: 'Salamander Marsh',
    description:
      'ribbit Gorgeous spot in Salamander Marsh, known for its lush greenery and many'
      + ' varieties of cattails and wildflowers. Every night, the local population of'
      + ' bioluminescent salamanders gather in the marsh - ribbit - making for an'
      + ' enchanting evening glow.',
    price: 220,
  },
  {
    ownerId: 2,
    address: '1021 Toadstool Terrace',
    city: 'Hopsburg',
    state: 'Toadtopia',
    country: 'The Ribbit Realm',
    lat: '61.188339',
    lng: '-149.908256',
    name: 'Frog Hollow',
    description:
      'A quaint spot in a small pond with plenty of activity nearby. ribbit.'
      + ' Great spot for food lovers, as Frog Hollow is famous for its'
      + ' large variety of exotic and flavorful bugs. ribbit',
    price: 75,
  },
]

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
    await Spot.bulkCreate(seedData);
  },

  async down(queryInterface, Sequelize) {
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
