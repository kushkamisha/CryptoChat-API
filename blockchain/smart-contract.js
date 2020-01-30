'use strict'

const fs = require('fs')
const path = require('path')
const Web3 = require('web3')
const web3 = new Web3(new Web3.providers.HttpProvider('https://ropsten.infura.io/v3/0ad545128d1244dfb79b68cbf4c36b7c'))

module.exports = class Contract {

    constructor(abiFilename, address) {
        this.abi = JSON.parse(
            fs.readFileSync(path.join(__dirname, abiFilename)))
        this.address = address
        this.contract = new web3.eth.Contract(this.abi, this.address)
    }

    instance() { return this.contract }

    balanceOf(address) {
        return this.contract.methods.balanceOf(address).call()
    }

    deposit(sender, privateKey, value) {
        return this.__send(sender, privateKey, 'deposit', [], value)
    }

    transfer(sender, privateKey, recipient, amount) {
        return this.__send(sender, privateKey, 'transfer', [recipient, amount])
    }

    withdraw(sender, privateKey, amount) {
        return this.__send(sender, privateKey, 'withdraw', [amount])
    }

    __send(sender, privateKey, method, params, value = 0) {
        const query = this.contract.methods[method](...params)
        const encodedABI = query.encodeABI()

        return web3.eth.accounts.signTransaction(
            {
                nonce: web3.eth.getTransactionCount(sender),
                data: encodedABI,
                from: sender,
                gas: 2000000,
                to: this.contract.options.address,
                value
            },
            privateKey,
            false,
        )
    }
}
