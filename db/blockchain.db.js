

const { query } = require('../utils/db')

const getUserAddress = userId =>
    query('select "Address" from "Wallet" where "UserId" = $1', [userId])

const saveTransfer = (from, to, tx) =>
    query(`
        insert into "Transaction"
            ("FromUserId", "ToUserId", "TransactionStatus", "RawTransaction")
        values
            ($1, $2, 'unpublished', $3)`, [from, to, tx])

module.exports = {
    getUserAddress,
    saveTransfer,
}
