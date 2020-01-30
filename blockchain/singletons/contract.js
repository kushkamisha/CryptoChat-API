'use strict'

require('dotenv').config()
const path = require('path')
const Contract = require('../smart-contract')

const contract = new Contract({
    abi: path.join('data', 'abi.json'),
    address: process.env.CONTRACT_ADDRESS,
})

module.exports = contract