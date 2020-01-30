'use strict'

const { web3 } = require('../blockchain')
const { getUserAddress } = require('../db/blockchain.db')
const contract = require('../blockchain/singletons/contract')
const logger = require('../logger')
const { checkSignedFunc } = require('../utils/blockchain')
const { toWei } = require('../utils/blockchain')

const balanceInAddress = userId =>
    new Promise((resolve, reject) =>
        getUserAddress(userId)
            .then(res => {
                const address = res[0].Address
                logger.debug(`User address: ${address}`)
                return web3.eth.getBalance(address)
            })
            .then(balance => resolve(balance))
            .catch(err => {
                logger.error({ err })
                reject(err)
            }))

const balanceInContract = userId =>
    new Promise((resolve, reject) =>
        getUserAddress(userId)
            .then(res => {
                const address = res[0].Address
                logger.debug(`User address: ${address}`)
                return contract.balanceOf(address)
            })
            .then(balance => resolve(balance))
            .catch(err => {
                logger.error({ err })
                reject(err)
            }))

const signTransfer = ({ from, to, amount, prKey }) =>
    new Promise((resolve, reject) =>
        contract.transfer({ from, to, amount: toWei(amount), prKey })
            .then(tx => {
                logger.debug(tx)
                const isGood = checkSignedFunc({
                    tx,
                    from,
                    params: ['address', 'uint256'],
                    paramsCheck: [to, amount],
                    func: 'transfer'
                })

                if (isGood) resolve(tx)
                else reject()
            }))

const publishTransfer = rawTx =>
    new Promise((resolve, reject) =>
        web3.eth.sendSignedTransaction(rawTx)
            .once('transactionHash', hash => {
                logger.debug(`Transaction hash: ${hash}`)
                resolve(hash)
            })
            .on('confirmation', (confNumber, receipt) => {
                console.log(`Confiramation number: ${confNumber}`)
                console.log(`Transaction hash: ${receipt.transactionHash}`)
            })
            .on('error', reject))

module.exports = {
    balanceInAddress,
    balanceInContract,
    signTransfer,
    publishTransfer,
}
