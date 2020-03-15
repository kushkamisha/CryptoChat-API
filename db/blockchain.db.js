

const { query } = require('../utils/db')

const getUserAddress = userId =>
    query('select "Address" from "Wallet" where "UserId" = $1', [userId])

const saveTransfer = (from, to, amount, tx) =>
    query(`
        insert into "Transaction" (
            "FromUserId",
            "ToUserId",
            "TransactionAmountWei",
            "TransactionStatus",
            "RawTransaction"
        ) values ($1, $2, $3, 'unpublished', $4)`, [from, to, amount, tx])

const lastUnpublishedTxAmountForChat = (from, to) =>
    query(`
        select "TransactionAmountWei" from "Transaction"
        where "FromUserId" = $1 and
              "ToUserId" = $2 and
              "TransactionStatus" = 'unpublished'
        order by "TransactionAmountWei"::bigint desc
        limit 1;`, [from, to])

const readMessage = msgId =>
    query(`
        update "ChatMessage"
        set "IsRead" = true
        where "ChatMessageId" != $1;`, [msgId])

module.exports = {
    getUserAddress,
    saveTransfer,
    lastUnpublishedTxAmountForChat,
    readMessage,
}
