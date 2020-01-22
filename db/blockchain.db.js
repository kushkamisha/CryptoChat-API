'use strict'

const { query } = require('../utils/db')

const getUserAddress = userId => 
    query(`select "Address" from "Wallet" where "UserId" = '${userId}'`)

module.exports = {
    getUserAddress,
}