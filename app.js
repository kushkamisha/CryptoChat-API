const express = require('express')
const bodyParser = require('body-parser')
const routes = require('./routes')
const config = require('./config')

const port = config.port || 3000
const app = express()
const server = require('http').createServer(app)
const io = new (require('./utils/socket'))(server)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/', routes)
io.start()

server.listen(port, () => console.log(`Example app listening on port ${port}!`))
