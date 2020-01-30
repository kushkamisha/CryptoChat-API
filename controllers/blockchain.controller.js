'use strict'

const { blockchain } = require('../services')
const { toEth } = require('../utils/blockchain')
const logger = require('../logger')

const balanceInAddress = (req, res) => {
    blockchain.balanceInAddress(req.decoded.userId)
        .then(balance => {
            const balanceInEth = toEth(balance)
            logger.debug(`User balance: ${balanceInEth}`)
            res.status(200).send({
                status: 'success',
                currency: 'ETH',
                balanceInEth
            })
        })
        .catch(err => {
            logger.error(err)
            res.sendStatus(500)
        })
}

const balanceInContract = (req, res) => {
    blockchain.balanceInContract(req.decoded.userId)
        .then(balance => {
            const balanceInEth = toEth(balance)
            logger.debug(`User balance: ${balanceInEth}`)
            res.status(200).send({
                status: 'success',
                currency: 'ETH',
                balanceInEth
            })
        })
        .catch(err => {
            logger.error(err)
            res.sendStatus(500)
        })
}

const signTransfer = (req, res) => {
    /**
     * @todo vadidate from, to, amount, prKey
     */
    blockchain.signTransfer(req.body)
        .then(tx => {
            logger.debug({ tx })
            res.status(200).send({
                status: 'success',
                rawTx: tx.rawTransaction
            })
        })
        .catch(err => {
            logger.error(err)
            res.sendStatus(500)
        })
}

module.exports = {
    balanceInAddress,
    balanceInContract,
    signTransfer,
}
