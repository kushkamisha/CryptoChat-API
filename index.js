'use strict'

const { handleWeb3Error, txParams, verifySigner } = require('./blockchain/utils')
const { web3, contract } = require('./blockchain')

// Create an address
// const { address, privateKey, signTransaction, sign, encrypt } = web3.eth.accounts.create()
// console.log({ address, privateKey, signTransaction, sign, encrypt })

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
    web3.utils.toWei('1', 'ether')
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

    showBalances()

    // web3.eth.sendSignedTransaction(tx.rawTransaction)
    //     // .once('transactionHash', hash => console.log(`Transaction hash: ${hash}`))
    //     .on('confirmation', (confNumber, receipt) => {
    //         console.log(`Confiramation number: ${confNumber}`)
    //         console.log(`Transaction hash: ${receipt.transactionHash}`)
    //     })
    //     .on('error', err => console.error(handleWeb3Error(err)))
    //     // .then(function (receipt) {
    //     //     // will be fired once the receipt is mined
    //     // });
})

function showBalances() {
    let address = '0xBd670c480DE5F6FE13a649dbc13Ed52A33251edF'
    contract.balanceOf(address)
        .then(bal =>
            console.log(`Balance of ${address} is ${web3.utils.fromWei(bal)} Ether`))

    address = '0xbc99f9A7A24252239D318C31De697e38635566E5'
    contract.balanceOf(address)
        .then(bal =>
            console.log(`Balance of ${address} is ${web3.utils.fromWei(bal)} Ether`))
}
