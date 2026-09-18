"use strict";

// Deduplicated catalog snapshot from retailer_product_stock_details.csv.
// Keep the data bundled here so deployment does not need prediction-service.
const products = require("./data/products.json");

module.exports = {
  async up(queryInterface) {
    const now = new Date();

    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.bulkInsert("products", products.map((product) => ({
        ...product,
        created_at: now,
        updated_at: now,
      })), { transaction });
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.bulkDelete("products", {
        product_id: {
          [Sequelize.Op.in]: products.map((product) => product.product_id),
        },
      }, { transaction });
    });
  },
};
