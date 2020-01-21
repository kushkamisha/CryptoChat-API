'use strict'

const bcrypt = require('bcrypt')
const logger = require('../logger')

const hash = sha3 => new Promise((resolve, reject) => 
    bcrypt.hash(sha3, 13, (err, hash) => {
        if (err) reject(err)
        resolve(hash)
    }))

const verify = (sha3, hash) => new Promise((resolve, reject) => {
    bcrypt.compare(sha3, hash)
        .then(res => {
            logger.debug(`Bcrypt result: ${res}`)
            resolve(res)
        })
        .catch(err => reject(err))
})

module.exports = {
    hash,
    verify,
}
