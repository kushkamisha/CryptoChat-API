'use strict'

const Web3 = require('web3')
const web3 = new Web3(new Web3.providers.HttpProvider('https://ropsten.infura.io/v3/0ad545128d1244dfb79b68cbf4c36b7c'))
const abi = require('ethereumjs-abi')
const txDecoder = require('ethereum-tx-decoder')

const { Web3Error } = require('./errors')

module.exports = {
    handleWeb3Error: err => {
        const [, type, vmType, info] = err.toString().split(':').map(x => x.trim())
        
        if (type !== 'Returned error') return new Web3Error(`Unknown error type: ${err}`)
        if (vmType != 'VM Exception while processing transaction')
            return new Web3Error(`Unknown error VM type: ${vmType}`)

        return new Web3Error(info)
    },

    verifySigner: (address, rawTx) => {
        const signer = web3.eth.accounts.recoverTransaction(rawTx)

        return signer === address
    },

    txParams: (rawTx, types = []) => {
        const decodedTx = txDecoder.decodeTx(rawTx)

        const rawData = decodedTx.data
        const funcHex = rawData.slice(0, 10)
        const data = rawData.slice(10)

        return [funcHex, ...abi.rawDecode(types, Buffer.from(data, 'hex'))]
    },

    generateKeys: () => {
        const { address, privateKey } = web3.eth.accounts.create()
        return [address, privateKey]
    }
}
