'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    var now = new Date();
    return queryInterface.bulkInsert('jobs', [
      {
        userId: 1,
        title: 'Event 1',
        slug: 'event number 1',
        description: 'This is a event number 1',
        date: new Date(now.getDay()),
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 2,
        title: 'Event 2',
        slug: 'event number 2',
        description: 'This is a event number 2',
        date: new Date(now.getDay()),
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 3,
        title: 'Event 3',
        slug: 'event number 3',
        description: 'This is a event number 3',
        date: new Date(now.getDay()),
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('jobs', null, {});
  },
};

