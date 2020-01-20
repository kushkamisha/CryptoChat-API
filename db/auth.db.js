'use strict'

const logger = require('../logger')
const pool = require('./pool')

const register = ({ email, pass, firstName, middleName, lastName, birthDate,
    keywords, description }) => new Promise((resolve, reject) => 
    pool
        .connect()
        .then(client => client
            .query('SELECT * FROM "User" WHERE "UserId" = $1', [1])
            .then(res => {
                client.release()
                resolve(res.rows[0])
            })
            .catch(err => {
                client.release()
                reject(err.stack)
            })))

module.exports = {
    register
}
