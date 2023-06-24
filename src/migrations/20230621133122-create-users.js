"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn("users", "image", {
        type: Sequelize.STRING(1000),
        allowNull: true,
      }),
      queryInterface.addColumn("users", "phone", {
        type: Sequelize.STRING(20),
        allowNull: true,
      }),
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
