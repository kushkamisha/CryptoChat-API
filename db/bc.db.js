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
        ) values ($1, $2, $3, $4, $5);`,
    [from, to, msgId, amount, tx])

const setAllTxsAsOutdated = (fromUser, toUser) =>
    query(`
        update "Transaction"
        set "TransactionStatus" = 'outdated'
        where "FromUserId" = $1 and
            "ToUserId" = $2 and
            "TransactionStatus" = 'unpublished';`, [fromUser, toUser])

const getRawTxById = txId =>
    query(`
        select "TransactionStatus", "RawTransaction"
        from "Transaction"
        where "TransactionId" = $1;`, [txId])

const lastUnpublishedTxAmountForChat = (from, to) =>
    query(`
        select "TransactionAmountWei" from "Transaction"
        where "FromUserId" = $1 and
              "ToUserId" = $2 and
              "TransactionStatus" = 'unpublished'
        order by "TransactionAmountWei"::bigint desc
        limit 1;`, [from, to])

const getUnpublishedTransfers = userId =>
    query(`
        select
        case
            when "FromUserId" = $1 then 'out'
            else 'in'
        end as "Direction",
        case
            when "FromUserId" = $1 then (
                select concat("FirstName", ' ', "MiddleName", ' ', "LastName")
                    as "FullName"
                from "User"
                where "UserId" = "Transaction"."ToUserId"
            )
            else (
                select concat("FirstName", ' ',
                              -- "MiddleName", ' ',
                              "LastName")
                    as "FullName"
                from "User"
                where "UserId" = "Transaction"."FromUserId"
            )
        end,
        "TransactionAmountWei", "CreatedAt", "TransactionId"
    from "Transaction"
    where ("FromUserId" = $1 or "ToUserId" = $1)
        and "TransactionStatus" = 'unpublished'
    order by "CreatedAt" desc;`, [userId])

const changeTxStatusTo = (status, txId) =>
    query(`
        update "Transaction"
        set "TransactionStatus" = $1
        where "TransactionId" = $2;`, [status, txId])

module.exports = {
    getUserAddress,
    setAllTxsAsOutdated,
    saveTransfer,
    getRawTxById,
    lastUnpublishedTxAmountForChat,
    getUnpublishedTransfers,
    changeTxStatusTo,
}
