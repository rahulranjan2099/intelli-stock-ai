import User from "./User.js";
import Conversation from "./Conversation.js";
import Message from "./Message.js";

User.hasMany(Conversation, {
    foreignKey: "userId",
    as: "conversations",
})

Conversation.belongsTo(User, {
    foreignKey: "userId",
    as: "User",
})

Conversation.hasMany(Message, {
    foreignKey: "conversationId",
    as: "messages",
})

Message.belongsTo(Conversation, {
    foreignKey: "conversationId",
    as: "conversation",
})

export {
    User,
    Conversation,
    Message,
};