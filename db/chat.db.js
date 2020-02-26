const { query } = require('../utils/db')

const getPersonalChats = userId =>
    query(`
        select "User"."UserId", "Chat"."ChatId", "FirstName", "LastName"
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
        select "UserId", "MessageText", "CreatedAt"
        from "ChatMessage"
        where "ChatId" = $1
        order by "CreatedAt";`, [chatId])

module.exports = {
    getPersonalChats,
    getMessages,
}
