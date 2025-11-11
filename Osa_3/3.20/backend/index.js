require('dotenv').config()
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const app = express()
const PhoneNumber = require('./models/number')

app.use(express.static('dist'))
app.use(express.json())
//app.use(requestLogger)
app.use(cors())

console.log("MONGODB_URI:", process.env.MONGODB_URI);

morgan.token('phoneNumber', (request, response) => { 
  if (request.method === 'POST') {
    return JSON.stringify(request.body);
  }
  return '';
});

app.use(morgan('tiny'))

app.get('/api/persons', (request, response, next) => {
  PhoneNumber.find({}).then(numbers => {
    response.json(numbers)
  })
  .catch(error => next(error))
})

app.get('/info', (request, response, next) => {
  PhoneNumber.countDocuments({}).then(count => {
    const date = new Date()
    response.send(`
      <p>Phonebook has info for ${count} people</p>
      <p>${date}</p>`)
  })
  .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  PhoneNumber.findById(request.params.id)
    .then(number => {
      if(number) {
        response.json(number)
      } else {
        console.log(request.params.id)
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  PhoneNumber.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
  /*const id = request.params.id
  phoneNumbers = Number.filter(number => number.id !== id)

  response.status(204).end()*/
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if (!body.name) {
    return response.status(400).json({ error: 'name missing' })
  }

  if (!body.number) {
    return response.status(400).json({ 
      error: 'number missing' 
    })
  }

  const number = new PhoneNumber({
    name: body.name,
    number: body.number
  })

  number.save().then(savedNumber => {
    response.json(savedNumber)
  })
  .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const {id} = request.params
  const {number} = request.body

  if (!number) {
    return response.status(400).json({ error: 'number missing' })
  }

  PhoneNumber.findByIdAndUpdate(
    id,
    {number},
    {new: true, runValidators: true, context: 'query'}
  )
    .then(updatedNumber => {
      if (updatedNumber) {
        response.json(updatedNumber)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.use((req, res, next) => {
  console.log('REQUEST:', req.method, req.path)
  next()
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({error: error.message})
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
