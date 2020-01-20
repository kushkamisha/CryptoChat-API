'use strict'

const logger = require('../logger')
const { db } = require('../config')
const { Pool } = require('pg')

const pool = new Pool({
    user: db.user,
    host: db.host,
    database: db.database,
    password: db.password,
    port: db.port
})

pool.on('error', (err, client) => {
    logger.error(`Unexpected error on idle client ${err}`)
})

module.exports = pool
