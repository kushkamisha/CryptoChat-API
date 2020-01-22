'use strict'

const toEth = balance => {
    return Math.round(balance / 10**13) / 10**5
}

module.exports = {
    toEth,
}
