require('dotenv').config()
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const app = express()
const Number = require('./models/number')

app.use(express.static('dist'))
app.use(express.json())
//app.use(requestLogger)
app.use(cors())


morgan.token('phoneNumber', (request, response) => { 
  if (request.method === 'POST') {
    return JSON.stringify(request.body);
  }
  return '';
});

app.use(morgan('tiny'))

app.get('/api/persons', (request, response) => {
  Number.find({}).then(numbers => {
    response.json(numbers)
  })
})

app.get('/info', (request, response) => {
  const amount = Number.length
  const date = new Date();

  response.send(`
    <p>Phonebook has info for ${amount} people</p>
    <p>${date}</p>`)
})

app.get('/api/persons/:id', (request, response, next) => {
  Number.findById(request.params.id)
    .then(number => {
      if(number) {
        response.json(number)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Number.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
  /*const id = request.params.id
  phoneNumbers = Number.filter(number => number.id !== id)

  response.status(204).end()*/
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name) {
    return response.status(400).json({ error: 'name missing' })
  }

  if (!body.number) {
    return response.status(400).json({ 
      error: 'number missing' 
    })
  }

  const number = new Number({
    name: body.name,
    number: body.number
  })

  number.save().then(savedNumber => {
    response.json(savedNumber)
  })
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

/*setInterval(() => {}, 1000)
console.log('Server is setup successfully')*/
