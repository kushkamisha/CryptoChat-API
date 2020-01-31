module.exports = {
    Web3Error: class Web3Error extends Error {
        constructor(message) {
            super(message)
            this.name = 'Web3 Error'
        }
    },
    BreakPromiseChainError: class BreakPromiseChainError extends Error {
        constructor(msg) {
            super(msg)
            this.name = 'BreakPromiseChainError'
        }
    },
}
