'use strict'

const logger = require('../logger')
const pool = require('./pool')

const query = (queryString, params=[]) => new Promise((resolve, reject) =>
    pool
        .connect()
        .then(client => client
            .query(queryString, params)
            .then(res => {
                client.release()
                resolve(res.rows)
            })
            .catch(err => {
                client.release()
                reject(err.stack)
            })))

const register = (email, pass, firstName, middleName, lastName, birthDate,
    keywords, description) => 
    new Promise((resolve, reject) => {
        query(`
        insert into "User" (
            "Email", "FirstName", "MiddleName", "LastName",
            "BirthDate", "Description", "PasswordHash"
        ) values ($1, $2, $3, $4, $5, $6, $7) returning "UserId"`,
        [email, firstName, middleName, lastName, birthDate, description, pass])
            .then(res => {
                const queries = []
                const userId = res[0].UserId

                logger.debug({ userId })

                keywords.forEach(keyword =>
                    queries.push(query(`
                    insert into "UserKeyword" ("UserId", "UserKeyword")
                    values ($1, $2)`,
                    [userId, keyword])))

                Promise.all(queries)
                    .then(() => resolve(true))
                    .catch(err => reject(err))
            })
            .catch(err => reject(err))
    })
    

const login = email => query(`
    select * from "User" where "Email" = '${email}'`)

module.exports = {
    register,
    login
}
