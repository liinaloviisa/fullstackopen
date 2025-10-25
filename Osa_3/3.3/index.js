const express = require('express')
const app = express()

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

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)