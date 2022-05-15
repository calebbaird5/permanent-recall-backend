'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      email: {
        type: Sequelize.STRING(128),
        allowNull: false,
      },
      passwordHash: {
        type: Sequelize.STRING(128),
        allowNull: false,
      },
      firstName: {
        type: Sequelize.STRING(128),
        allowNull: true,
      },
      lastName: {
        type: Sequelize.STRING(128),
        allowNull: true,
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });
  },

  async down (queryInterface) {
    await queryInterface.dropTable('Users');
  }
};
