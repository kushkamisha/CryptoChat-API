const abi = require('ethereumjs-abi')
const txDecoder = require('ethereum-tx-decoder')

const logger = require('../logger')
const { web3 } = require('../bc/singletons')
const { Web3Error } = require('../errors')

const toEth = amount => Math.round(amount / 10 ** 13) / 10 ** 5

const toWei = amount => parseInt(amount * 10 ** 18)

const generateKeys = () => {
    const { address, privateKey } = web3.eth.accounts.create()
    return [address, privateKey]
}

const txParams = (rawTx, types = []) => {
    const decodedTx = txDecoder.decodeTx(rawTx)

    const rawData = decodedTx.data
    const funcHex = rawData.slice(0, 10)
    const data = rawData.slice(10)

    return [funcHex, ...abi.rawDecode(types, Buffer.from(data, 'hex'))]
}

const verifySigner = (address, rawTx) => {
    const signer = web3.eth.accounts.recoverTransaction(rawTx)

    return signer === address
}

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
    if (parseInt(paramsCheck[1]) !== parseInt(args[2].toString())) return false

    return true
}

const handleWeb3Error = err => {
    const [, type, vmType, info] = err.toString().split(':').map(x => x.trim())

    if (type !== 'Returned error')
        return new Web3Error(`Unknown error type: ${err}`)
    if (vmType !== 'VM Exception while processing transaction')
        return new Web3Error(`Unknown error VM type: ${vmType}`)

    return new Web3Error(info)
}

module.exports = {
    toEth,
    toWei,
    checkSignedFunc,
    handleWeb3Error,
    verifySigner,
    txParams,
    generateKeys,
}
