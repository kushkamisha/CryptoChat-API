'use strict'

const { auth } = require('../db')
const { hash, verify } = require('../utils/crypto')
const { BreakPromiseChainError } = require('../errors')
const logger = require('../logger')

const register = (email, pass, firstName, middleName, lastName, birthDate,
    keywords, description) =>
    new Promise((resolve, reject) =>
        hash(pass)
            .then(passwordHash => {
                logger.debug({ passwordHash })

                auth.checkUniqueness(email)
                    .then(uniqueness => {
                        if (!uniqueness) {
                            resolve(0)
                            throw new BreakPromiseChainError()
                        }
                        return
                    })
                    .then(() => auth.registerUser(email, firstName, middleName, lastName,
                        birthDate, description, passwordHash))
                    .then(res => {
                        const userId = res[0].UserId
                        logger.debug({ userId })
                        return auth.setUserKeywords(keywords, userId)
                    })
                    .then(userId => auth.createWallet(userId))
                    .then(({ userId, prKey }) => resolve({ userId, prKey }))
                    .catch(err => {
                        if (err.name !== 'BreakPromiseChainError') reject(err)
                    })
            }))

const login = ({ email, pass }) => new Promise((resolve, reject) => 
    auth.login(email)
        .then(res => {
            logger.debug({ note: 'DB auth.login', res })

            if (!res.length) resolve(false)
            if (!pass) resolve(false)

            verify(pass, res[0].PasswordHash)
                .then(result => {
                    logger.debug(result)
                    if (result) resolve(res[0].UserId)
                    else resolve(0)
                })
                .catch(err => reject(err))
        })
        .catch(err => reject(err)))

module.exports = {
    register,
    login
}
