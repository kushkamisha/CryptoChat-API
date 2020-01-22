'use strict'

module.exports = class BreakPromiseChainError extends Error {
    constructor(msg) {
        super(msg)
        this.name = 'BreakPromiseChainError'
    }
}
