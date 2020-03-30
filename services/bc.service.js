const { web3 } = require('../bc')
const db = require('../db/bc.db')
const { contract } = require('../bc/singletons')
const logger = require('../logger')
const { checkSignedFunc } = require('../utils/bc')
const { getDateTime } = require('../utils')
const { toWei } = require('../utils/bc')

const balanceInAddress = userId =>
    new Promise((resolve, reject) =>
        db.getUserAddress(userId)
            .then(res => {
                const address = res[0].Address
                logger.debug(`User address: ${address}`)
                return web3.eth.getBalance(address)
            })
            .then(balance => resolve(balance))
            .catch(err => {
                console.error({ err })
                reject(err)
            }))

const balanceInContract = userId =>
    new Promise((resolve, reject) =>
        db.getUserAddress(userId)
            .then(res => {
                const address = res[0].Address
                logger.debug(`User address: ${address}`)
                return contract.balanceOf(address)
            })
            .then(balance => resolve(balance))
            .catch(err => {
                console.error({ err })
                reject(err)
            }))

const signTransfer = ({ from, to, amount, prKey }) =>
    new Promise((resolve, reject) =>
        contract.transfer({ from, to, amount: toWei(amount), prKey })
            .then(tx => {
                logger.debug({ tx })
                const isGood = checkSignedFunc({
                    rawTx: tx.rawTransaction,
                    from,
                    params: ['address', 'uint256'],
                    paramsCheck: [to, toWei(amount)],
                    func: 'transfer'
                })

                if (isGood) resolve(tx)
                else reject()
            })
            .catch(reject))

const signTransferByUserId = ({ msgId, fromUserId, toUserId, amount, prKey }) =>
    new Promise((resolve, reject) =>
        Promise.all([
            db.getUserAddress(fromUserId),
            db.getUserAddress(toUserId),
            db.lastUnpublishedTxAmountForChat(fromUserId, toUserId)
        ])
            .then(([
                [{ Address: from }],
                [{ Address: to }],
                txAmount
            ]) => {
                console.log({ msgId, fromUserId, toUserId, amount, prKey })
                const lastAmount = txAmount.length ?
                    txAmount[0].TransactionAmountWei : 0
                console.log({ txAmount, lastAmount })
                const fullAmount = parseInt(lastAmount) + parseInt(amount)
                console.log({ fullAmount })
                return Promise.all([
                    contract.transfer({
                        from,
                        to,
                        amount: fullAmount,
                        prKey
                    }),
                    from,
                    to,
                    fullAmount
                ])
            })
            .then(([tx, from, to, fullAmount]) => {
                const isGood = checkSignedFunc({
                    rawTx: tx.rawTransaction,
                    from,
                    params: ['address', 'uint256'],
                    paramsCheck: [to, fullAmount],
                    func: 'transfer'
                })

                console.log({ isGood })
                console.log({ tx })

                if (isGood) {
                    return Promise.all([
                        db.saveTransfer(
                            fromUserId,
                            toUserId,
                            msgId,
                            fullAmount,
                            tx.rawTransaction
                        ),
                        fullAmount,
                        tx
                    ])
                } else reject(new Error('The transaction is not valid'))
            })
            .then(([, fullAmount, tx]) => resolve([fullAmount, tx]))
            .catch(reject))

const publishTransfer = rawTx =>
    new Promise((resolve, reject) => {
        console.log({ rawTx })
        web3.eth.sendSignedTransaction(rawTx)
            .once('transactionHash', hash => {
                logger.debug(`Transaction hash: ${hash}`)
                resolve(hash)
            })
            // .on('confirmation', (confNumber, receipt) => {
            //     console.log(`Confiramation number: ${confNumber}`)
            //     console.log(`Transaction hash: ${receipt.transactionHash}`)
            // })
            .on('error', reject)
    })

const verifyTransfer = (rawTx, from, to, amount) =>
    checkSignedFunc({
        rawTx,
        from,
        func: 'transfer',
        params: ['address', 'uint256'],
        paramsCheck: [to, amount]
    })

const transfers = userId => new Promise((resolve, reject) =>
    db.getUnpublishedTransfers(userId)
        .then(txs => {
            txs = txs.map(tx => ({
                fullName: tx.FullName,
                direction: tx.Direction,
                amount: `${tx.TransactionAmountWei / 10 ** 18}`,
                createdAt: getDateTime(tx.CreatedAt)
            }))
            resolve(txs)
        })
        .catch(reject))

module.exports = {
    balanceInAddress,
    balanceInContract,
    signTransfer,
    signTransferByUserId,
    verifyTransfer,
    publishTransfer,
    transfers,
}
