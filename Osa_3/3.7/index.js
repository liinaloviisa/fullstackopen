const express = require('express')
const app = express()
const morgan = require('morgan')

app.use(morgan('tiny'))

app.use(express.json())

let puhnumerot = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "010-123456"
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523"
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345"
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122"
  }
]

console.log(puhnumerot)

app.get('/api/persons', (request, response) => {
  response.json(puhnumerot)
})

app.get('/info', (request, response) => {
  const amount = puhnumerot.length
  const date = new Date();

  response.send(`
    <p>Phonebook has info for ${amount} people</p>
    <p>${date}</p>`)
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const numero = puhnumerot.find(numero => numero.id === id)

    if (numero) {
    response.json(numero)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  puhnumerot = puhnumerot.filter(numero => numero.id !== id)

  response.status(204).end()
})

const generateId = () => {
  return String(Math.floor(Math.random()*(1000000-puhnumerot.length)+puhnumerot.length));
}

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name) {
    return response.status(400).json({ 
      error: 'name missing' 
    })
  }

  if (!body.number) {
    return response.status(400).json({ 
      error: 'number missing' 
    })
  }

  puhnumerot.forEach(name => {
    if (name === body.name)
      return response.status(400).json({ 
        error: 'name must be unique' 
    })
  });

  const numero = {
    id: generateId(),
    name: body.name,
    number: body.number
  }

  puhnumerot = puhnumerot.concat(numero)
  console.log(numero)
  response.json(numero)
})

//morgan('tiny')
//morgan(':method :url :status :res[content-length] - :response-time ms')


const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)