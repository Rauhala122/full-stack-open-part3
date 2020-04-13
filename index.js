const express = require('express')
const morgan = require("morgan")
require('dotenv').config()
const app = express()
const cors = require("cors")


app.use(express.json())
app.use(morgan('tiny'))
app.use(cors())
app.use(express.static('build'))


morgan.token('body', function (req, res) { return JSON.stringify(req.body) });
app.use(morgan(':method :url :status :response-time ms - :res[content-length] :body - :req[content-length]'));

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

const mongoose = require('mongoose')

const url =
  `mongodb+srv://rauhala:tarkman51@cluster0-y4sfi.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Person = mongoose.model('Person', personSchema)

app.use(requestLogger)

let persons = [
    {
      "name": "Arto Hellas",
      "number": "040-123456",
      "id": 1
    },
    {
      "name": "Ada Lovelace",
      "number": "39-44-5323523",
      "id": 2
    },
    {
      "name": "Dan Abramov",
      "number": "12-43-234345",
      "id": 3
    },
    {
      "name": "Mary Poppendieck",
      "number": "39-23-6423122",
      "id": 4
    }
]

app.get("/", (req, res) => {
  res.send("<h2>Hello world </h2>")
})

app.get("/info", (req, res) => {
  res.send(`<p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date()}</p>
    `)
})

app.get("/api/persons", (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons.map(person => person.toJSON()))
  })
})

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then(person => {
    response.json(person.toJSON())
    console.log(person)
  })
})

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id)
  Person.findById(id).then(person => {
    response.json(person.toJSON())
  })
})

const generateId = () => {
  const getRandomInt = (max) => {
    return Math.floor(Math.random() * Math.floor(max));
  }

  return getRandomInt(1000000)
}

app.post("/api/persons", (request, response) => {
  const body = request.body

  if (persons.find(person => person.name === body.name)) {
    return response.status(400).json({
      error: 'this persons has already been added'
    })
  } else {
    if (!body.name || !body.number) {
      return response.status(400).json({
        error: 'content missing'
      })
    }
  }

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save().then(savedPerson => {
    response.json(savedPerson.toJSON())
  })

})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const port = process.env.PORT

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
