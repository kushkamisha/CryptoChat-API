const { db } = require('../config')
const { Pool } = require('pg')

const pool = new Pool({
    host: db.host,
    user: db.user,
    database: db.database,
    password: db.password,
    port: db.port
})

pool.on('error', err => console.error(`Unexpected error on idle client ${err}`))

module.exports = pool
