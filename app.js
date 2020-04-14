const config = require("./utils/config")
const express = require('express')
const app = express()
const morgan = require("morgan")
const cors = require("cors")
const logger = require("./utils/logger")
const mongoose = require("mongoose")
const personsRouter = require('./controllers/persons')
const middleware = require('./utils/middleware')

const url = process.env.MONGODB_URI

console.log("connecting to ", url)

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })


app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use('/api/persons', personsRouter)
app.use(morgan('tiny'))


morgan.token('body', function (req, res) { return JSON.stringify(req.body) });
app.use(morgan(':method :url :status :response-time ms - :res[content-length] :body - :req[content-length]'));



app.use(middleware.requestLogger)
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
