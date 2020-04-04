const { auth } = require('../db')
const { hash, verify } = require('../utils/crypto')
const { BreakPromiseChainError } = require('../errors')
const logger = require('../logger')

const register = (email, pass, firstName, middleName, lastName, birthDate,
    keywords, description, avatar) =>
    new Promise((resolve, reject) =>
        hash(pass)
            .then(passwordHash => {
                if (!firstName) firstName = undefined
                if (!middleName) middleName = undefined
                if (!lastName) lastName = undefined
                if (!birthDate) birthDate = undefined
                if (!description) description = undefined
                if (!avatar) avatar = undefined

                logger.debug({ passwordHash })

                auth.checkUniqueness(email)
                    .then(uniqueness => {
                        if (!uniqueness) {
                            resolve(0)
                            throw new BreakPromiseChainError()
                        }
                        return
                    })
                    .then(() => auth.registerUser(
                        email,
                        firstName,
                        middleName,
                        lastName,
                        birthDate,
                        description,
                        avatar,
                        passwordHash
                    ))
                    .then(res => {
                        const userId = res[0].UserId
                        logger.debug({ userId })
                        return auth.setUserKeywords(userId, keywords)
                    })
                    .then(userId => auth.createWallet(userId))
                    .then(({ userId, address, prKey }) =>
                        resolve({ userId, address, prKey }))
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

const updateUserData = ({ userId, keywords, description }) =>
    new Promise((resolve, reject) =>
        auth.setUserKeywords(userId, keywords)
            .then(userId => auth.setUserDescription(userId, description))
            .then(resolve)
            .catch(reject))

const myProfile = userId =>
    new Promise((resolve, reject) =>
        auth.myProfile(userId)
            .then(resolve)
            .catch(reject))

module.exports = {
    register,
    login,
    updateUserData,
    myProfile,
}
