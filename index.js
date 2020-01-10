'use strict'

const fs = require('fs')
const Web3 = require('web3')
// const web3 = new Web3(new Web3.providers.HttpProvider('https://ropsten.infura.io/v3/0ad545128d1244dfb79b68cbf4c36b7c'))
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'))
const abi = require('ethereumjs-abi')
const path = require('path')
const rlp = require('rlp')
const txDecoder = require('ethereum-tx-decoder')

// Create an address
const { address, privateKey, signTransaction, sign, encrypt } = web3.eth.accounts.create()
console.log({ address, privateKey, signTransaction, sign, encrypt });

(async () => {
    const contractAddress = '0x24FbBB41074552a8Daea6a574A01F3324A8c11BA'
    const contractAbi = JSON.parse(fs.readFileSync(path.join(__dirname, 'abi.json')))

    const to = '0xbc99f9A7A24252239D318C31De697e38635566E5'
    const amount = web3.utils.toWei('0.1', 'ether')
    const gas = await web3.eth.getGasPrice()
    // const data = '' //
    
    const contract = new web3.eth.Contract(contractAbi, contractAddress)
    // send(contract,
    //     '0xBd670c480DE5F6FE13a649dbc13Ed52A33251edF',
    //     web3.utils.toWei('10', 'ether'),
    //     '150a4d7cec81df9f8da1625e02a73ff51b827419bad7b29b744201577ddff8d3',
    //     )
    //     .then(data => console.log(data))

    // transfer(
    //     '0xbc99f9A7A24252239D318C31De697e38635566E5',
    //     web3.utils.toWei('0.05', 'ether'),
    //     contract,
    //     '0xBd670c480DE5F6FE13a649dbc13Ed52A33251edF',
    //     '150a4d7cec81df9f8da1625e02a73ff51b827419bad7b29b744201577ddff8d3',)
    //     .then(console.log)

    // withdraw(
    //     web3.utils.toWei('1', 'ether'),
    //     contract,
    //     '0xBd670c480DE5F6FE13a649dbc13Ed52A33251edF',
    //     '150a4d7cec81df9f8da1625e02a73ff51b827419bad7b29b744201577ddff8d3'
    // ).then(console.log)

    contract.methods.balanceOf('0xBd670c480DE5F6FE13a649dbc13Ed52A33251edF').call()
        .then(res => console.log(`Balance of '0xBd670c480DE5F6FE13a649dbc13Ed52A33251edF': ${res}`))

    contract.methods.balanceOf('0xbc99f9A7A24252239D318C31De697e38635566E5').call()
        .then(res => console.log(`Balance of '0xbc99f9A7A24252239D318C31De697e38635566E5': ${res}`))
    

    // const tx = {
    //     to,
    //     value: web3.utils.toHex(amount),
    //     // gas: 200000,
    //     // data,
    //     gas,
    //     chainId: 3
    // }
    // const signature = await web3.eth.accounts.signTransaction(tx, privateKey)
    // console.log({ signature })

    // const raw = signature.rawTransaction

    // const decodedTx = txDecoder.decodeTx(raw)
    // console.log(decodedTx)

    // const verificationHash = web3.utils.sha3(to, web3.utils.toWei('0.00001', 'ether'), 0)

    // console.log({ verificationHash })
    // const signer = web3.eth.accounts.recover({
    //     messageHash: verificationHash, //web3.eth.accounts.hashMessage(tx),
    //     r: signature.r,
    //     s: signature.s,
    //     v: signature.v
    // })
    
    // console.log({ signer })
    // console.log(signer === address)
})()

async function send(contract, sender, value, privateKey) {
    const query = contract.methods.deposit(/* params */)
    const encodedABI = query.encodeABI()
    const signedTx = await web3.eth.accounts.signTransaction(
        {
            nonce: web3.eth.getTransactionCount(sender),
            data: encodedABI,
            from: sender,
            gas: 2000000,
            to: contract.options.address,
            value
        },
        privateKey,
        false,
    )

    return web3.eth.sendSignedTransaction(signedTx.rawTransaction)
}

async function transfer(recipient, amount, contract, sender, privateKey) {
    const query = contract.methods.transfer(recipient, amount)
    const encodedABI = query.encodeABI()
    const signedTx = await web3.eth.accounts.signTransaction(
        {
            nonce: web3.eth.getTransactionCount(sender),
            data: encodedABI,
            from: sender,
            gas: 2000000,
            to: contract.options.address
        },
        privateKey,
        false,
    )

    return web3.eth.sendSignedTransaction(signedTx.rawTransaction)
}

async function withdraw(amount, contract, sender, privateKey) {
    const query = contract.methods.withdraw(amount)
    const encodedABI = query.encodeABI()
    const signedTx = await web3.eth.accounts.signTransaction(
        {
            nonce: web3.eth.getTransactionCount(sender),
            data: encodedABI,
            from: sender,
            gas: 2000000,
            to: contract.options.address
        },
        privateKey,
        false,
    )

    return web3.eth.sendSignedTransaction(signedTx.rawTransaction)
}
