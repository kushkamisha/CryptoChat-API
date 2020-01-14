'use strict'

const { Web3Error } = require('./errors')

module.exports = {
    handleWeb3Error: err => {
        const [, type, vmType, info] = err.toString().split(':').map(x => x.trim())
        
        if (type !== 'Returned error') return new Web3Error(`Unknown error type: ${err}`)
        if (vmType != 'VM Exception while processing transaction')
            return new Web3Error(`Unknown error VM type: ${vmType}`)

        return new Web3Error(info)
    }
}
