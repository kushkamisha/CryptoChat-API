'use strict'

const { web3 } = require('../blockchain')
const { getUserAddress } = require('../db/blockchain.db')
const logger = require('../logger')

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

const balanceInContract = (req, res, next) => {
    res.sendStatus(501)
}

module.exports = {
    balanceInAddress,
    balanceInContract,
}
