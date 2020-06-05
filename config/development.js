module.exports = {
    env: 'development',
    port: process.env.DEV_APP_PORT,
    db: {
        user: process.env.DEV_PGUSER,
        host: process.env.DEV_PGHOST,
        database: process.env.DEV_PGDATABASE,
        password: process.env.DEV_PGPASSWORD,
        port: process.env.DEV_PGPORT,
    },
    jwt: {
        key: process.env.DEV_JWT_PR_KEY,
        expiresIn: process.env.DEV_JWT_EXPIRE_TIME,
    },
    bc: {
        infura: process.env.DEV_INFURA_ROPSTEN,
        contractAddr: process.env.DEV_CONTRACT_ADDRESS
    },
}
