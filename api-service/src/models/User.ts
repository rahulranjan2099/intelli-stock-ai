import {
    DataTypes,
    Model,
    Optional
} from "sequelize";

import sequelize from "../config/database.js";

interface UserAttributes {
    id: number;
    name: string;
    email: string;
    password: string;
}

interface UserCreationAttributes extends Optional<UserAttributes, "id"> {}

class User 
    extends Model<UserAttributes, UserCreationAttributes>
    implements UserAttributes
    {
        declare id: number;
        declare name: string;
        declare email: string;
        declare password: string;

        declare readonly createdAt: Date;
        declare readonly updatedAt: Date;
    }

    User.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
            }
        },
        {
            sequelize,
            tableName: "users",
            modelName: "User",
            underscored: true,
            timestamps: true,
        }
    )

export default User;
