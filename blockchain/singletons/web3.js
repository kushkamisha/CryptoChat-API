'use strict'

const { blockchain } = require('../../config')
const Web3 = require('web3')
const web3 = new Web3(new Web3.providers.HttpProvider(blockchain.infura))

module.exports = web3
