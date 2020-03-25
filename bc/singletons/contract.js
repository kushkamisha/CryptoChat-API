

const { bc } = require('../../config')
const path = require('path')
const Contract = require('../smart-contract')

const contract = new Contract({
    abi: path.join('data', 'abi.json'),
    address: bc.contractAddr,
})

module.exports = contract
