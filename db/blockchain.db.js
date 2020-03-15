const { query } = require('../utils/db')

const getUserAddress = userId =>
    query('select "Address" from "Wallet" where "UserId" = $1', [userId])

const saveTransfer = (from, to, msgId, amount, tx) =>
    query(`
        insert into "Transaction" (
            "FromUserId",
            "ToUserId",
            "ForMessageId",
            "TransactionAmountWei",
            "RawTransaction"
        ) values ($1, $2, $3, $4, $5)`,
    [from, to, msgId, amount, tx])

const lastUnpublishedTxAmountForChat = (from, to) =>
    query(`
        select "TransactionAmountWei" from "Transaction"
        where "FromUserId" = $1 and
              "ToUserId" = $2 and
              "TransactionStatus" = 'unpublished'
        order by "TransactionAmountWei"::bigint desc
        limit 1;`, [from, to])

module.exports = {
    getUserAddress,
    saveTransfer,
    lastUnpublishedTxAmountForChat,
}
