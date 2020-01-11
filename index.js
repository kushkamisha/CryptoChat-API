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
const contract = new Contract('abi.json', '0x24FbBB41074552a8Daea6a574A01F3324A8c11BA')

// Create an address
// const { address, privateKey, signTransaction, sign, encrypt } = web3.eth.accounts.create()
// console.log({ address, privateKey, signTransaction, sign, encrypt });

    // const contractAddress = '0x24FbBB41074552a8Daea6a574A01F3324A8c11BA'
    // const contractAbi = JSON.parse(fs.readFileSync(path.join(__dirname, 'abi.json')))

    // const to = '0xbc99f9A7A24252239D318C31De697e38635566E5'
    // const amount = web3.utils.toWei('0.1', 'ether')
    // const gas = await web3.eth.getGasPrice()
    // const data = '' //
    
    // const contract = new web3.eth.Contract(contractAbi, contractAddress)
    // send(
    //     contract,
    //     '0xBd670c480DE5F6FE13a649dbc13Ed52A33251edF',
    //     web3.utils.toWei('10', 'ether'),
    //     '150a4d7cec81df9f8da1625e02a73ff51b827419bad7b29b744201577ddff8d3',
    //     )
    //     .then(tx => {
    //         console.log(tx)

    //         const decodedTx = txDecoder.decodeTx(tx.rawTransaction)
    //         console.log(decodedTx)

    //         // showContractBalances()
    //     })

    // transfer(
    //     '0xbc99f9A7A24252239D318C31De697e38635566E5',
    //     web3.utils.toWei('0.05', 'ether'),
    //     contract,
    //     '0xBd670c480DE5F6FE13a649dbc13Ed52A33251edF',
    //     '150a4d7cec81df9f8da1625e02a73ff51b827419bad7b29b744201577ddff8d3'
    //     )
    //     .then(tx => {
    //         console.log(tx)

    //         const decodedTx = txDecoder.decodeTx(tx.rawTransaction)
    //         console.log(decodedTx)

    //         const data = decodedTx.data.slice(10)
    //         console.log(data)

    //         const decoded = abi.rawDecode(['address', 'uint256'], Buffer.from(data, 'hex'))
    //         console.log(decoded)
    //         console.log(`Recipient address: 0x${decoded[0]}`)
    //         console.log(`Sent amount: ${web3.utils.fromWei(decoded[1])} Ether`)

    //         console.log(`Is the signer address correct? ${verifySigner(
    //                 '0xBd670c480DE5F6FE13a649dbc13Ed52A33251edF', tx) ?
    //                 'yes' : 'no'
    //             }`)

    //         // showContractBalances()
    //     })

contract.withdraw(
    '0xBd670c480DE5F6FE13a649dbc13Ed52A33251edF',
    '150a4d7cec81df9f8da1625e02a73ff51b827419bad7b29b744201577ddff8d3',
    web3.utils.toWei('1', 'ether')
).then(tx => {
    console.log(tx)

    const decodedTx = txDecoder.decodeTx(tx.rawTransaction)
    console.log({ decodedTx })

    let data = decodedTx.data
    console.log({ data })
    data = data.slice(10)
    console.log({ data })

    const decoded = abi.rawDecode(['uint256'], Buffer.from(data, 'hex'))
    console.log({ decoded })
    console.log(`Withdrawal amount: ${web3.utils.fromWei(decoded[0])} Ether`)

    console.log(`Is the signer address correct? ${verifySigner(
        '0xBd670c480DE5F6FE13a649dbc13Ed52A33251edF', tx) ?
        'yes' : 'no'
        }`)

    // web3.eth.sendSignedTransaction(tx.rawTransaction)
})

let address = '0xBd670c480DE5F6FE13a649dbc13Ed52A33251edF'
contract.balanceOf(address)
    .then(bal => 
        console.log(`Balance of ${address} is ${web3.utils.fromWei(bal)} Ether`))

address = '0xbc99f9A7A24252239D318C31De697e38635566E5'
contract.balanceOf(address)
    .then(bal =>
        console.log(`Balance of ${address} is ${web3.utils.fromWei(bal)} Ether`))

// showContractBalances()

// contract.deposit(
//     '0xbc99f9A7A24252239D318C31De697e38635566E5',
//     '3711613e3e796754e50c0bc1be237ce603600ec7b77744f72b60a284690f1c29',
//     web3.utils.toWei('1', 'ether')
// ).then(tx => {
//     console.log(tx)

//     // web3.eth.sendSignedTransaction(tx.rawTransaction)
// })

// contract.transfer(
//     '0xbc99f9A7A24252239D318C31De697e38635566E5',
//     '3711613e3e796754e50c0bc1be237ce603600ec7b77744f72b60a284690f1c29',
//     '0xBd670c480DE5F6FE13a649dbc13Ed52A33251edF',
//     web3.utils.toWei('8', 'ether')
// ).then(tx => {
//     console.log(tx)
//     web3.eth.sendSignedTransaction(tx.rawTransaction)
// })

function showContractBalances() {
    contract.instance().methods.balanceOf('0xBd670c480DE5F6FE13a649dbc13Ed52A33251edF').call()
        .then(res => console.log(`Balance of '0xBd670c480DE5F6FE13a649dbc13Ed52A33251edF': ${res}`))

    contract.instance().methods.balanceOf('0xbc99f9A7A24252239D318C31De697e38635566E5').call()
        .then(res => console.log(`Balance of '0xbc99f9A7A24252239D318C31De697e38635566E5': ${res}`))
}

function verifySigner(address, tx) {
    const signer = web3.eth.accounts.recover({
        messageHash: tx.messageHash,
        r: tx.r,
        s: tx.s,
        v: tx.v
    })

    return signer === address
}
