'use strict'

module.exports = {
    Web3Error: class Web3Error extends Error {
        constructor(message) {
            super(message)
            this.name = 'Web3 Error'
        }
    }
}
