const { query } = require('../utils/db')

const findPersonalChats = userId => new Promise((resolve, reject) =>
    query(`
        select "User"."UserId", "FirstName", "LastName" from "ChatUser"
        inner join "Chat" on "Chat"."ChatId" = "ChatUser"."ChatId"
        inner join "User" on "User"."UserId" = "ChatUser"."UserId"
        where "Chat"."ChatId" in (
            select "ChatId" from "ChatUser" where "UserId" = $1
        )
        and "ChatType" != 'group'
        and "ChatUser"."UserId" != $1;
    `, [userId])
        .then(resolve)
        .catch(reject))

module.exports = {
    findPersonalChats,
}
