'use strict'

const { auth } = require('../services')

/*
 * call other imported services, or same service but different functions here if you need to
*/
const register = async (req, res, next) => {
    const { email, pass } = req.body
    try {
        await auth.register(email, pass)
        // other service call (or same service, different function can go here)
        // i.e. - await generateBlogpostPreview()
        res.sendStatus(201)
        next()
    } catch (e) {
        console.log(e.message)
        res.sendStatus(500) && next(e => console.error(e))
    }
}

module.exports = {
    register
}
