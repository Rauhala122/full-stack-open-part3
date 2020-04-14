const personsRouter = require("express").Router()
const Person = require("../models/person")

// app.get("/", (req, res) => {
//   res.send("<h2>Hello world </h2>")
// })

// app.get("/info", (req, res) => {
//   res.send(`<p>Phonebook has info for ${persons.length} people</p>
//     <p>${new Date()}</p>
//     `)
// })

personsRouter.get("/", (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons.map(person => person.toJSON()))
  })
})

personsRouter.get('/:id', (request, response) => {
  Person.findById(request.params.id).then(person => {
    if (person) {
      response.json(person.toJSON())
    } else {
      response.status(404).end()
    }
  })
  .catch(error => {
    console.log("ERROR ", error)
    response.status(400).send({ error: 'malformatted id' })
  })
  .catch(error => next(error))
})

personsRouter.delete("/:id", (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

const generateId = () => {
  const getRandomInt = (max) => {
    return Math.floor(Math.random() * Math.floor(max));
  }

  return getRandomInt(1000000)
}

personsRouter.post("/", (request, response, next) => {
  const body = request.body


  const person = new Person({
    name: body.name,
    number: body.number
  })

  Person.find({ name: body.name }).then(persons => {
    if (persons.length === 0 ) {

      person.save()
        .then(savedPerson =>  savedPerson.toJSON())
        .then(savedAndFormattedPerson => {
          response.json(savedAndFormattedPerson)
      })
        .catch(error => next(error))

    } else {
      return response.status(400).json({
        error: 'this persons has already been added'
      })
    }
  })

})

personsRouter.put("/:id", (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson.toJSON())
    })
    .catch(error => next(error))
})

module.exports = personsRouter
