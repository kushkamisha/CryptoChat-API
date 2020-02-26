const socketio = require('socket.io')
const logger = require('../logger')
const { verifySocketToken } = require('../middleware')

class Socket {

    constructor(server) {
        this.io = socketio(server)
        this.connections = {}
    }

    start() {
        this.io.use(verifySocketToken)

        this.io.on('connection', socket => {
            logger.debug(`
    New user
        userId: ${socket.userId}
        socketId: ${socket.id}`)
            this.connections[socket.userId] = socket.id
        })

        this.io.on('disconnect', args => {
            logger.debug('A client is disconnected')
            console.log({ args })
        })
    }

    emit(event, params) {
        this.io.emit(event, params)
    }

    emitSmart(chatUsers, event, params) {
        logger.debug(this.connections)
        for (const userId in chatUsers) {
            this.io.to(this.connections[userId]).emit(event, params)
        }
    }
}

module.exports = Socket
