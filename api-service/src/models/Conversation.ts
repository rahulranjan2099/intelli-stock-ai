import {
    DataTypes,
    Model,
    Optional
} from "sequelize";

import sequelize from  "../config/database.js"

interface ConversationAttributes {
    id: number;
    userId: number;
    title: string;
}

interface ConversationCreationAttributes extends Optional<ConversationAttributes, "id" | "title"> {}

class Conversation 
    extends Model<ConversationAttributes, ConversationCreationAttributes> 
    implements ConversationAttributes{
        declare id: number;
        declare userId: number;
        declare title: string;

        declare readonly createdAt: Date;
        declare readonly updatedAt: Date;
}

Conversation.init(
    {
        id:{
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        userId:{
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "user_id"
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "New Conversation",
        },
    }, {
        sequelize,
        tableName: "conversations",
        timestamps: true,
        underscored: true,
    }
);

export default Conversation;