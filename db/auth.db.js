const logger = require('../logger')
const { query } = require('../utils/db')
const { generateKeys } = require('../utils/blockchain')

const checkUniqueness = email => new Promise((resolve, reject) =>
    query('select * from "User" where "Email" = $1', [email])
        .then(users => {
            if (users.length) resolve(false)
            resolve(true)
        })
        .catch(err => reject(err)))

const registerUser = (email, firstName, middleName, lastName, birthDate,
    description, pass) =>
    query(`
        insert into "User" (
            "Email", "FirstName", "MiddleName", "LastName",
            "BirthDate", "Description", "PasswordHash"
        ) values ($1, $2, $3, $4, $5, $6, $7) returning "UserId"`,
    [email, firstName, middleName, lastName, birthDate, description, pass])

const setUserKeywords = (userId, keywords) => new Promise((resolve, reject) => {
    const queries = []

    keywords.forEach(keyword =>
        queries.push(query(`
            insert into "UserKeyword" ("UserId", "UserKeyword")
            values ($1, $2)`,
        [userId, keyword])))

    Promise.all(queries)
        .then(() => resolve(userId))
        .catch(err => reject(err))
})

const setUserDescription = (userId, description) =>
    query(`
        update "User" set "Description" = $1
        where "UserId" = $2;`, [description, userId])

const createWallet = userId => new Promise((resolve, reject) => {
    const [address, prKey] = generateKeys()
    logger.debug({ address, prKey })

    query(`insert into "Wallet" ("UserId", "Address")
        values ($1, $2) returning "Address"`, [userId, address])
        .then(() => resolve({ userId, address, prKey }))
        .catch(err => reject(err))
})

const login = email => query('select * from "User" where "Email" = $1', [email])

module.exports = {
    checkUniqueness,
    registerUser,
    setUserKeywords,
    setUserDescription,
    createWallet,
    login,
}
