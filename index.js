'use strict'

const fs = require('fs')
const Web3 = require('web3')
// const web3 = new Web3(new Web3.providers.HttpProvider('https://ropsten.infura.io/v3/0ad545128d1244dfb79b68cbf4c36b7c'))
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'))
const abi = require('ethereumjs-abi')
const path = require('path')
const rlp = require('rlp')
const txDecoder = require('ethereum-tx-decoder')
const Contract = require('./smart-contract')

// const gas = await web3.eth.getGasPrice()
const contract = new Contract('abi.json', '0x24FbBB41074552a8Daea6a574A01F3324A8c11BA')

// Create an address
// const { address, privateKey, signTransaction, sign, encrypt } = web3.eth.accounts.create()
// console.log({ address, privateKey, signTransaction, sign, encrypt })
 
let address = '0xBd670c480DE5F6FE13a649dbc13Ed52A33251edF'
contract.balanceOf(address)
    .then(bal =>
        console.log(`Balance of ${address} is ${web3.utils.fromWei(bal)} Ether`))

address = '0xbc99f9A7A24252239D318C31De697e38635566E5'
contract.balanceOf(address)
    .then(bal =>
        console.log(`Balance of ${address} is ${web3.utils.fromWei(bal)} Ether`))

// contract.withdraw(
//     '0xBd670c480DE5F6FE13a649dbc13Ed52A33251edF',
//     '150a4d7cec81df9f8da1625e02a73ff51b827419bad7b29b744201577ddff8d3',
//     web3.utils.toWei('1', 'ether')
// // ).then(tx => web3.eth.sendSignedTransaction(tx.rawTransaction))

// contract.deposit(
//     '0xbc99f9A7A24252239D318C31De697e38635566E5',
//     '3711613e3e796754e50c0bc1be237ce603600ec7b77744f72b60a284690f1c29',
//     web3.utils.toWei('1', 'ether')
//     ).then(tx => web3.eth.sendSignedTransaction(tx.rawTransaction))

contract.transfer(
    '0xbc99f9A7A24252239D318C31De697e38635566E5',
    '3711613e3e796754e50c0bc1be237ce603600ec7b77744f72b60a284690f1c29',
    '0xBd670c480DE5F6FE13a649dbc13Ed52A33251edF',
    web3.utils.toWei('8.00034', 'ether')
).then(tx => {
    // console.log(tx)

    const params = txParams(tx, ['address', 'uint256'])

    const signature = 'transfer(address,uint256)'
    console.log(`Is called required function? ${
        web3.utils.sha3(signature).substr(0, 10) === params[0] ? 'yes' : 'no'}`)
    console.log(`Recipient address is ${params[1]}`)
    console.log(`Transfer amount: ${web3.utils.fromWei(params[2])} Ether`)

    console.log(`Is the signer address correct? ${verifySigner(
        '0xbc99f9A7A24252239D318C31De697e38635566E5', tx) ?
        'yes' : 'no'
        }\n`)

    // web3.eth.sendSignedTransaction(tx.rawTransaction)
})

function verifySigner(address, tx) {
    const signer = web3.eth.accounts.recover({
        messageHash: tx.messageHash,
        r: tx.r,
        s: tx.s,
        v: tx.v
    })

    return signer === address
}

function txParams(tx, types=[]) {
    const decodedTx = txDecoder.decodeTx(tx.rawTransaction)
    // console.log({ decodedTx })

    const rawData = decodedTx.data
    const funcHex = rawData.slice(0, 10)
    const data = rawData.slice(10)

    return [funcHex, ...abi.rawDecode(types, Buffer.from(data, 'hex'))]
}
