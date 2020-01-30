'use strict'

require('dotenv').config()
const path = require('path')
const Contract = require('../smart-contract')

// const gas = await web3.eth.getGasPrice()
const contract = new Contract(path.join('data', 'abi.json'), process.env.CONTRACT_ADDRESS)

module.exports = contract