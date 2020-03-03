const { auth } = require('../services')
const { generateToken } = require('../utils/crypto')
const logger = require('../logger')

const register = (req, res, next) => {
    const {
        email, pass, firstName, middleName, lastName, birthDate,
        keywords, description
    } = req.body

    // birthDate must be in format yyyy-mm-dd

    const keywordsArr = keywords ? keywords.split(',').map(x => x.trim()) : []

    auth.register(
        email, pass, firstName, middleName, lastName, birthDate,
        keywordsArr, description
    )
        .then(({ userId, address, prKey }) => {
            logger.info(`Register result: ${!!userId}. User id: ${userId}`)

            if (userId) {
                generateToken(userId)
                    .then(token =>
                        res.status(200).send({
                            status: 'success',
                            userId,
                            address,
                            prKey,
                            token
                        }))
            } else res.status(409).send({
                status: 'error',
                message: 'There is already a user with such username. Maybe, \
that\'s your old account'
            })

            next()
        })
        .catch(err => {
            console.error({ err })
            res.sendStatus(500) && next(console.error(err))
        })
}

const updateUserData = (req, res) => {
    const keywords = req.body.keywords
    const keywordsArr = keywords ? keywords.split(',').map(x => x.trim()) : []
    auth.updateUserData({
        userId: req.body.decoded.userId,
        keywords: keywordsArr,
        description: req.body.description
    })
        .then(() => res.status(200).send({
            status: 'success',
            message: 'User data were updated'
        }))
        .catch(err => {
            console.error(err)
            res.sendStatus(500)
        })
}

const login = (req, res, next) => {
    auth.login(req.body)
        .then(userId => {
            logger.info(`Login result (user id): ${userId}`)

            if (userId) {
                generateToken(userId)
                    .then(token =>
                        res.status(200).send({
                            status: 'success',
                            userId,
                            token
                        }))
            } else res.status(401).send({
                status: 'error',
                message: 'Your email or password is incorrect'
            })

            next()
        })
        .catch(err => {
            logger.error({ err })
            res.sendStatus(500)
        })
}

module.exports = {
    register,
    updateUserData,
    login,
}
