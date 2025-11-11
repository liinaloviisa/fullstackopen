require('dotenv').config()
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const app = express()
const Number = require('./models/number')

app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

morgan.token('phoneNumber', (request, response) => { 
  if (request.method === 'POST') {
    return JSON.stringify(request.body);
  }
  return '';
});

app.use(morgan('tiny'))

/*let puhnumerot = [
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
]*/

//console.log(puhnumerot)

/*app.get('/', (request, response) => {
  response.json(puhnumerot)
})*/

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

app.get('/api/persons/:id', (request, response) => {
  Number.finById(request.params.id).then(number => {
    response.json(number)
  })
  /*const id = request.params.id
  const numero = puhnumerot.find(numero => numero.id === id)

    if (numero) {
    response.json(numero)
  } else {
    response.status(404).end()
  }*/
})

//const path = require('path');

//app.get('/*', (request, response) => {
//  response.sendFile(path.join(__dirname, 'dist', 'index.html'));
//});

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  phoneNumbers = Number.filter(number => number.id !== id)

  response.status(204).end()
})

/*const generateId = () => {
  return String(Math.floor(Math.random()*(1000000-puhnumerot.length)+puhnumerot.length));
}*/

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

  /*puhnumerot.forEach(name => {
    if (name === body.name)
      return response.status(400).json({ 
        error: 'name must be unique' 
    })
  });*/

  const number = new Number({
    //id: generateId(),
    name: body.name,
    number: body.number
  })

  number.save().then(savedNumber => {
    response.json(savedNumber)
  })
  /*puhnumerot = puhnumerot.concat(number)
  console.log(number)
  response.json(number)*/
})

/*const path = require('path')

app.get('*', (request, response) => {
  response.sendFile(path.resolve(__dirname, 'dist', 'index.html'))
})*/

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

/*setInterval(() => {}, 1000)
console.log('Server is setup successfully')*/
