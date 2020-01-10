'use strict'
const Web3 = require('web3')
const web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:7545'))

console.log(web3.utils.soliditySha3(100000000000000000 + 8) ===
            web3.utils.soliditySha3(100000000000000000)) // true
console.log(web3.utils.soliditySha3(100000000000000000 - 8) ===
            web3.utils.soliditySha3(100000000000000000)) // true

console.log(web3.utils.soliditySha3(100000000000000000 + 9) ===
            web3.utils.soliditySha3(100000000000000000)) // false
console.log(web3.utils.soliditySha3(100000000000000000 - 9) ===
            web3.utils.soliditySha3(100000000000000000)) // false

console.log(web3.utils.soliditySha3(1000000000000000000 + 64) ===
            web3.utils.soliditySha3(1000000000000000000)) // true
console.log(web3.utils.soliditySha3(1000000000000000000 - 64) ===
            web3.utils.soliditySha3(1000000000000000000)) // true

console.log(web3.utils.soliditySha3(1000000000000000000 + 65) ===
            web3.utils.soliditySha3(1000000000000000000)) // false
console.log(web3.utils.soliditySha3(1000000000000000000 - 65) ===
            web3.utils.soliditySha3(1000000000000000000)) // false

// web3.sha3(leftPad(web3.toHex(web3.toWei(100)).slice(2).toString(16), 64, 0), { encoding: 'hex' })
