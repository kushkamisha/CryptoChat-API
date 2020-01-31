'use strict'

const logger = require('../logger')

const web3 = require('../blockchain/singletons/web3')

const { txParams, verifySigner } = require('../blockchain/utils')

const toEth = amount => Math.round(amount / 10**13) / 10**5

const toWei = amount => parseInt(amount * 10**18)

const checkSignedFunc = ({ rawTx, from, func, params, paramsCheck }) => {
    console.log({ rawTx, from, func, params, paramsCheck })
    const args = txParams(rawTx, params)
    logger.debug({ args })
    const signature = `${func}(${params.join(',')})`
    console.log({ signature })

    if (!verifySigner(from, rawTx)) return false
    // Is called a required function?
    if (web3.utils.sha3(signature).substr(0, 10) !== args[0]) return false
    if (paramsCheck[0].toLowerCase() !== `0x${args[1]}`) return false
    if (toWei(paramsCheck[1]) !== parseInt(args[2].toString())) return false

    return true
}

module.exports = {
    toEth,
    toWei,
    checkSignedFunc,
}
