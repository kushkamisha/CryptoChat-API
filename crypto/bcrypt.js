'use strict'

const bcrypt = require('bcrypt')
const shaa = '353fef7b991b4e440f4fc92b20032f10eb735a9951b4f0ecee0e257eb7945f77cf9b19c8129442b950582a2bb841f3f84692910e0844206d8ac66bbd79fcc630' // adam

bcrypt.hash(shaa, 13, (err, hash) => {

    if (err) console.error(err)
    console.log(hash.toString('hex'))

    bcrypt.compare(shaa, hash).then(function (result) {
        console.log(result ? 'success' : 'failure')
    })
})
