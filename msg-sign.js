'use strict'
const Web3 = require('web3')
const web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:7545'))

// Create an address
const { address, privateKey, signTransaction, sign, encrypt } = web3.eth.accounts.create()
console.log({ address, privateKey, signTransaction, sign, encrypt });


(async () => {
    const to = '0x625c4B2b9661Fb176C55683Cdc8abe7003856355'
    const amount = web3.utils.toWei('0.00001', 'ether')
    const nonce = 0
    const hash = web3.utils.soliditySha3(to, amount, nonce)

    console.log(`In wei: ${web3.utils.toWei('0.00001', 'ether')}`)

    const signature = await web3.eth.accounts.sign(hash, privateKey)
    console.log({ signature })

    const verificationHash = web3.utils.soliditySha3(to, web3.utils.toWei('0.00001', 'ether'), 0)
    const signer = web3.eth.accounts.recover({
        messageHash: web3.eth.accounts.hashMessage(verificationHash),
        r: signature.r,
        s: signature.s,
        v: signature.v
    })
    // const signer = web3.eth.accounts.recover('Apples', signature.signature)
    console.log({ signer })
    console.log(signer === address)
})()
