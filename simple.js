/**
 * More info
 * @url https://yos.io/2018/11/16/ethereum-signatures/
 */

const Web3 = require('web3')
const web3 = new Web3(new Web3.providers.HttpProvider('https://ropsten.infura.io/v3/0ad545128d1244dfb79b68cbf4c36b7c'))
// const web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:7545'))

// Create an address
const { address, privateKey, signTransaction, sign, encrypt } = web3.eth.accounts.create()
console.log({ address, privateKey, signTransaction, sign, encrypt })

// Sign a tx
const rawTx = {
    to: '0xbc99f9A7A24252239D318C31De697e38635566E5',
    value: web3.utils.toHex(web3.utils.toWei('0.0001', 'ether')),
    gas: 200000,
    chainId: 3
};

(async () => {
    const signedTx = await web3.eth.accounts.signTransaction(rawTx, privateKey)
    console.log({ signedTx })

    const signer = web3.eth.accounts.recover(signedTx)
    console.log({ signer })
})()


// function signOrder(address, amount, nonce) {
//     const hash = web3.utils.soliditySha3(address, amount, nonce)
//     return web3.eth.accounts.sign(hash, privateKey)
// }

// const amount = 100000000000000000
// const nonce = 0

// const signature = signOrder(address, amount, nonce)
// console.log({ signature })

// const hash = web3.utils.soliditySha3(address, amount, nonce)
// console.log({ hash })
// web3.eth.accounts.recover(hash, signature, (err, signer) => {
//     if (err) console.error({ err })
//     console.log({ signer })
// })
