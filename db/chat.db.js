const { query } = require('../utils/db')

const getPersonalChats = userId =>
    query(`
        select "User"."UserId", "Chat"."ChatId", "ChatType", "FromUser",
            "ToUser", "FirstName", "LastName", "AvatarBase64",
            "MessageText", "LastMsgs"."CreatedAt"
        from "ChatUser"
        inner join "Chat" on "Chat"."ChatId" = "ChatUser"."ChatId"
        inner join "User" on "User"."UserId" = "ChatUser"."UserId"
        
        join (
        	select "tmp"."ChatId", "MessageText", "CreatedAt" from "ChatMessage"
			join (
			select "ChatId", max("ChatMessageId") as "ChatMessageId"
			from "ChatMessage"
            where "ChatId" in
                (select "ChatId" from "ChatUser" where "UserId" = $1)
			group by "ChatId"
			) as "tmp" on "ChatMessage"."ChatMessageId" = "tmp"."ChatMessageId"
        ) as "LastMsgs" on "Chat"."ChatId" = "LastMsgs"."ChatId"
        
        where "Chat"."ChatId" in (
            select "ChatId" from "ChatUser" where "UserId" = $1
        )
            and "ChatType" != 'group'
            and "ChatUser"."UserId" != $1
        order by "LastMsgs"."CreatedAt" desc;`, [userId])

const getMessages = chatId =>
    query(`
        select "ChatMessageId", "UserId", "MessageText", "IsRead", "CreatedAt"
        from "ChatMessage"
        where "ChatId" = $1
        order by "CreatedAt";`, [chatId])

const getTotalAmount = chatId =>
    query(`
        select "TransactionAmountWei" from "Transaction"
        join (
            select "FromUser", "ToUser"
            from "Chat"
            where "ChatId" = $1
        ) as "tmp"
        on "FromUserId" = "tmp"."FromUser" and "ToUserId" = "tmp"."ToUser"
        where "TransactionStatus" = 'unpublished';`, [chatId])

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
    getTotalAmount,
    getUnreadMessages,
    addMessage,
    getMessageById,
    getChatUsers,
    readMessages,
}
