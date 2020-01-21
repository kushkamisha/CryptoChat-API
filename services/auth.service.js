'use strict'

const { auth } = require('../db')
const { hash, verify } = require('../utils/crypto')
const logger = require('../logger')

const register = (email, pass, firstName, middleName, lastName, birthDate,
    keywords, description) =>
    new Promise((resolve, reject) =>
        hash(pass)
            .then(passwordHash => {
                logger.debug({ passwordHash })

                const keywordsArr = keywords.split(',').map(x => x.trim())

                auth.register(email, passwordHash, firstName, middleName,
                    lastName, birthDate, keywordsArr, description)
                    .then(res => resolve(res))
                    .catch(err => reject(err))
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
