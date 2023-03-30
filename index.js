require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const Person = require('./models/person')

const app = express()


let persons = [
  {
    "id": 1,
    "name": "Arto Hellas",
    "number": "040-123456"
  },
  {
    "id": 2,
    "name": "Ada Lovelace",
    "number": "39-44-5323523"
  },
  {
    "id": 3,
    "name": "Dan Abramov",
    "number": "12-43-234345"
  },
  {
    "id": 4,
    "name": "Mary Poppendieck",
    "number": "39-23-6423122"
  }
]


app.use(cors())
app.use(express.json())


morgan.token('post_body', function (request, response) {
  if (request.method === 'POST') {
    return JSON.stringify(request.body)
  }
  return null;
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post_body'))

app.use(express.static('build'))

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/info', (request, response) => {
  const ans = `Phonebook has info for ${persons.length} people<br/>${new Date().toString()}`
  response.send(ans)
})

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then(person => {
    response.json(person)
  })
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const personToDelete = persons.find(p => p.id === id)
  if (!personToDelete) {
    return response.status(404).end()
  }
  persons = persons.filter(p => p.id !== id)
  response.status(204).end()
})


app.post('/api/persons', (request, response) => {
  const body = request.body

  if (body.name === undefined) {
    return response.status(400).json({ error: 'name is missing' })
  }

  if (body.number === undefined) {
    return response.status(400).json({ error: 'number is missing' })
  }

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})