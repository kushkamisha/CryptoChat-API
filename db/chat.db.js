const { query } = require('../utils/db')

const getPersonalChats = userId =>
    query(`
        select "User"."UserId", "Chat"."ChatId", "ChatType", "FromUser",
            "ToUser", "FirstName", "LastName"
        from "ChatUser"
        inner join "Chat" on "Chat"."ChatId" = "ChatUser"."ChatId"
        inner join "User" on "User"."UserId" = "ChatUser"."UserId"
        where "Chat"."ChatId" in (
            select "ChatId" from "ChatUser" where "UserId" = $1
        )
            and "ChatType" != 'group'
            and "ChatUser"."UserId" != $1;`, [userId])

const getMessages = chatId =>
    query(`
        select "ChatMessageId", "UserId", "MessageText", "IsRead", "CreatedAt"
        from "ChatMessage"
        where "ChatId" = $1
        order by "CreatedAt";`, [chatId])

const getUnreadMessages = (chatId, userId) =>
    query(`
        select "UserId", "MessageText", "CreatedAt"
        from "ChatMessage"
        where "ChatId" = $1 and "IsRead" = false and "UserId" != $2
        order by "CreatedAt";`, [chatId, userId])

const addMessage = (chatId, userId, text) =>
    query(`
        insert into "ChatMessage"("ChatId", "UserId", "MessageText")
        values ($1, $2, $3)
        returning "CreatedAt", "ChatMessageId";`, [chatId, userId, text])

const getMessageById = id =>
    query(`
        select "ChatId", "UserId", "MessageText", "CreatedAt"
        from "ChatMessage"
        where "ChatMessageId" = $1;`, [id])

const getChatUsers = chatId =>
    query('select "UserId" from "ChatUser" where "ChatId" = $1;', [chatId])

const readMessages = (chatId, userId) =>
    query(`
    update "ChatMessage"
    set "IsRead" = true
    where "ChatId" = $1 and "UserId" != $2;`, [chatId, userId])

module.exports = {
    getPersonalChats,
    getMessages,
    getUnreadMessages,
    addMessage,
    getMessageById,
    getChatUsers,
    readMessages,
}
