import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database.js";

interface ProductAttributes {
  id: number;
  productId: string;
  productName: string;
}

type ProductCreationAttributes = Optional<ProductAttributes, "id">;

class Product extends Model<ProductAttributes, ProductCreationAttributes>
  implements ProductAttributes {
  declare id: number;
  declare productId: string;
  declare productName: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Product.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  productId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    field: "product_id",
  },
  productName: {
    type: DataTypes.STRING,
    allowNull: false,
    field: "product_name",
  },
}, {
  sequelize,
  tableName: "products",
  timestamps: true,
  underscored: true,
});

export default Product;
