"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.addColumn("messages", "type", {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "text",
      }, { transaction });
      await queryInterface.addColumn("messages", "data", {
        type: Sequelize.JSONB,
        allowNull: true,
      }, { transaction });
    });
  },

  async down(queryInterface) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.removeColumn("messages", "data", { transaction });
      await queryInterface.removeColumn("messages", "type", { transaction });
    });
  },
};
