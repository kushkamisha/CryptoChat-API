'use strict'

const sodium = require('sodium').api

let hash = Buffer.alloc(sodium.crypto_pwhash_STRBYTES)

const passwordBuffer = Buffer.from('353fef7b991b4e440f4fc92b20032f10eb735a9951b4f0ecee0e257eb7945f77cf9b19c8129442b950582a2bb841f3f84692910e0844206d8ac66bbd79fcc630') // adam

hash = sodium.crypto_pwhash_str(
    passwordBuffer,
    sodium.crypto_pwhash_OPSLIMIT_INTERACTIVE,
    sodium.crypto_pwhash_MEMLIMIT_INTERACTIVE
)

console.log(hash.toString('hex'))

// Validation:
if (sodium.crypto_pwhash_str_verify(
    hash,
    passwordBuffer
)) {
    // You are logged in
    console.log('success')
} else {
    console.log('error')
}
