const fs = require('fs')
const path = require('path')
const { bc } = require('../config')
const Web3 = require('web3')
const web3 = new Web3(new Web3.providers.HttpProvider(bc.infura))

module.exports = class Contract {

    constructor({ abi, address }) {
        this.abi = JSON.parse(
            fs.readFileSync(path.join(__dirname, abi)))
        this.address = address
        this.gas = 2000000
        this.contract = new web3.eth.Contract(this.abi, this.address)
    }

    instance() { return this.contract }

    balanceOf(address) {
        return this.contract.methods.balanceOf(address).call()
    }

    deposit(from, prKey, value) {
        return this.__send(from, prKey, 'deposit', [], value)
    }

    transfer({ from, prKey, to, amount }) {
        return this.__send(from, prKey, 'transfer', [to, amount])
    }

    withdraw(from, prKey, amount) {
        return this.__send(from, prKey, 'withdraw', [amount])
    }

    __send(from, prKey, method, params, value = 0) {
        const query = this.contract.methods[method](...params)
        const encodedABI = query.encodeABI()

        return web3.eth.accounts.signTransaction(
            {
                nonce: web3.eth.getTransactionCount(from),
                data: encodedABI,
                from,
                gas: this.gas,
                to: this.contract.options.address,
                value
            },
            prKey,
            false,
        )
    }
}
