import {
    DataTypes,
    Model,
    Optional,
} from "sequelize"

import sequelize from  "../config/database.js"

export type MessageRole = "USER" | "ASSISTANT"

interface MessageAttributes {
    id: number;
    conversationId: number;
    role: MessageRole;
    content: string
    type: "text" | "forecast";
    data: unknown | null;
}

interface MessageCreationAttributes extends Optional<MessageAttributes, "id" | "type" | "data">{}

class Message
    extends Model<MessageAttributes, MessageCreationAttributes>
    implements MessageAttributes{
        declare id: number;
        declare conversationId: number;
        declare role: MessageRole;
        declare content: string;
        declare type: "text" | "forecast";
        declare data: unknown | null;

        declare readonly createdAt: Date;
        declare readonly updatedAt: Date;
    }

Message.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    conversationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "conversation_id",
    },

    role: {
      type: DataTypes.ENUM("USER", "ASSISTANT"),
      allowNull: false,
    },

    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "text",
    },
    data: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    sequelize,
    tableName: "messages",
    timestamps: true,
    underscored: true,
  }
);

export default Message;
