const express = require('express')
const app = express()
const morgan = require('morgan')

morgan.token('body', (req, res) => JSON.stringify(req.body))
app.use(express.json())
app.use(morgan(':body'))

let persons =  [
  {
    "name": "1",
    "number": "1",
    "id": 1
  },
  {
    "name": "2",
    "number": "2",
    "id": 2
  },
  {
    "name": "3",
    "number": "3",
    "id": 3
  },
  {
    "name": "4",
    "number": "4",
    "id": 4
  },
  {
    "name": "5",
    "number": "5",
    "id": 5
  },
  {
    "name": "6",
    "number": "6",
    "id": 6
  },
  {
    "name": "8",
    "number": "8",
    "id": 8
  },
  {
    "name": "12",
    "number": "12",
    "id": 11
  },
  {
    "name": "13",
    "number": "13",
    "id": 12
  },
  {
    "name": "14",
    "number": "14",
    "id": 13
  },
  {
    "name": "15",
    "number": "15",
    "id": 14
  },
  {
    "name": "16",
    "number": "16",
    "id": 15
  },
  {
    "name": "17",
    "number": "17",
    "id": 16
  },
  {
    "name": "18",
    "number": "18",
    "id": 17
  },
  {
    "name": "19",
    "number": "19",
    "id": 18
  }
]

app.get('/', (req, res) => {
  res.send('<h1>Bananas</h1>')
})

app.get('/info', (req, res) => {
  console.log(req)
  const date = new Date()
  res.send(`
      <p>Phonebook has info for ${persons.length} people</p>
      <p>${date}</p>
    `)
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.post('/api/persons', (req, res) => {
  const { name, number } = req.body
  if(!name || !number){
    res.status(400).json({
      error: "content missing"
    })
  } else if (persons.find(person => person.name === name)) {
    res.status(409).json({
      error: "name must be unique"
    })
  } else {
    const maxId = persons.length > 0 ? Math.max(...persons.map(p => p.id)) : 0
    const id = maxId + 1
    const person = { id, name, number }
    persons = persons.concat(person)
    res.json(person)
  }
})

app.get('/api/persons/:id' , (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(person => person.id === id)
  if(person) {
    res.json(person)
  } else {
    res.sendStatus(404)
  }
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(person => person.id !== id)
  res.sendStatus(204)
})

const port = 3001
app.listen(port)
console.log(`Server running on port ${port}`)
