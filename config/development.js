'use strict'

module.exports = {
    env: 'development',
    db: {
        user: process.env.DEV_PGUSER,
        host: process.env.DEV_PGHOST,
        database: process.env.DEV_PGDATABASE,
        password: process.env.DEV_PGPASSWORD,
        port: process.env.DEV_PGPORT,
    },
    port: process.env.DEV_APP_PORT,
    jwtKey: process.env.DEV_JWT_PR_KEY,
}
