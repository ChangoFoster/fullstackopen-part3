require('dotenv').config()
const express = require('express')
const app = express()
const logger = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

logger.token('body', (request, response) => JSON.stringify(request.body))
app.use(express.static('build'))
app.use(express.json())
app.use(logger(':body'))
app.use(cors())

//Add in build ui script to copy from main repo to this one
//Change the frontend to show the error 3.20
app.get('/', (request, response) => {
  response.send('<h1>Bananas</h1>')
})

app.get('/info', (request, response) => {
  const date = new Date()
  response.send(`
      <p>Phonebook has info for ${persons.length} people</p>
      <p>${date}</p>
    `)
})

app.get('/api/persons', (request, response, next) => {
  Person.find({})
    .then(persons => persons.map(person => person.toJSON()))
    .then(personsFormattedMap => {
      response.json(personsFormattedMap)
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {

  const { name, number } = request.body

  if(!name || !number){
    response.status(400).json({ error: "content missing" })
  } else {

    const person = new Person({ name, number })

    person.save()
      .then(savedPerson => savedPerson.toJSON())
      .then(savedAndFormattedPerson => {
        response.json(savedAndFormattedPerson)
      })
      .catch(error => next(error))
  }
})

app.get('/api/persons/:id' , (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      person ? response.json(person.toJSON()) : response.sendStatus(404)
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body
  const person = { name, number }

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => updatedPerson.toJSON())
    .then(updatedAndFormattedPerson => {
      response.json(updatedAndFormattedPerson)
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => { response.sendStatus(204) })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError' ) {
    return response.status(400).send({ error: error.message })
  }
  next(error)
}

app.use(errorHandler)

const port = process.env.PORT
app.listen(port)
console.log(`Server running on port ${port}`)
