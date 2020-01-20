'use strict'

const { auth } = require('../db')

/*
  * if you need to make calls to additional tables, data stores (Redis, for example), 
  * or call an external endpoint as part of creating the blogpost, add them to this service
*/
const register = async (email, pass) => new Promise((resolve, reject) =>
    auth.register(email, pass)
        .then(res => resolve(res))
        .catch(err => reject(err)))

module.exports = {
    register
}
