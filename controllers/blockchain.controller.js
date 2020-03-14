

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
            console.error(err)
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
            console.error(err)
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
            if (err.code === 'INVALID_ARGUMENT' && err.arg === 'amount') {
                return res.send({
                    status: 'error',
                    message: 'Insufficient funds'
                })
            }
            console.error(err)
            res.sendStatus(500)
        })
}

const signTransferByUserId = (req, res) => {
    /**
     * @todo vadidate from, to, amount, prKey
     */
    blockchain.signTransferByUserId({
        fromUserId: req.body.decoded.userId,
        toUserId: req.body.toUserId,
        amount: req.body.amount,
        prKey: req.body.prKey
    })
        .then(([totalAmount, tx]) => {
            logger.debug({ totalAmount, tx })
            res.status(200).send({
                status: 'success',
                rawTx: tx.rawTransaction,
                totalAmount
            })
        })
        .catch(err => {
            if (err.code === 'INVALID_ARGUMENT' && err.arg === 'amount') {
                return res.send({
                    status: 'error',
                    message: 'Insufficient funds'
                })
            }
            console.error(err)
            res.sendStatus(500)
        })
}

const publishTransfer = (req, res) => {
    /**
     * @todo validate rawTx
     * @todo if try to send the second time - Internal server error
     * (nonce too low)
     */
    blockchain.publishTransfer(req.body.rawTx)
        .then(hash => {
            logger.debug({ hash })
            res.status(200).send({
                status: 'mining...',
                txHash: hash
            })
        })
        .catch(err => {
            console.error(err)
            console.log({ err })
            res.sendStatus(500)
        })
}

const verifyTransfer = (req, res) => {
    /**
     * @todo validate tx, from, to, amount
     */
    const { rawTx, from, to, amount } = req.body
    const isGood = blockchain.verifyTransfer(rawTx, from, to, amount)
    if (isGood) {
        res.status(200).send({
            status: 'success',
            msg: 'The transaction is valid'
        })
    } else {
        res.status(200).send({
            status: 'error',
            msg: 'The transaction params and your params are different'
        })
    }
}

module.exports = {
    balanceInAddress,
    balanceInContract,
    signTransfer,
    signTransferByUserId,
    verifyTransfer,
    publishTransfer,
}
