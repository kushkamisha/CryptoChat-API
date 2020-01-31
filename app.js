

const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const routes = require('./routes')
const config = require('./config')

const port = config.port || 3000

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => res.send('App is working'))

app.use('/api', routes)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
