'use strict'

const pool = require('../db/pool')

const query = (queryString, params = []) => new Promise((resolve, reject) =>
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

module.exports = {
    query,
}