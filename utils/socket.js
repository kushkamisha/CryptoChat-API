const socketio = require('socket.io')
const { verifySocketToken } = require('../middleware')

class Socket {

    constructor(server) {
        this.io = socketio(server)
    }

    start() {
        this.io.use(verifySocketToken)

        this.io.on('connection', socket => {
            console.log('A new user is connected')
        })
    }
}

module.exports = Socket
