'use strict'

const path = require('path')
const Contract = require('../smart-contract')

// const gas = await web3.eth.getGasPrice()
const contract = new Contract(path.join('data', 'abi.json'), '0x24FbBB41074552a8Daea6a574A01F3324A8c11BA')

module.exports = contract