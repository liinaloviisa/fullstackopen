const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://liinaloviisa:${password}@osa3c.ejk12mt.mongodb.net/NoteApp?retryWrites=true&w=majority&appName=Osa3c`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const numberSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Number = mongoose.model('Number', numberSchema)

const numbers = [
  { name: 'Arto Hellas', number: '010-123456' },
  { name: 'Ada Lovelace', number: '39-44-5323523' },
  { name: 'Dan Abramov', number: '12-43-234345' },
  { name: 'Mary Poppendieck', number: '39-23-6423122' }
];

Note.insertMany(numbers)
  .then(result => {
    //console.log(result)
    result.forEach(number => {
      console.log(number)
  })
  mongoose.connection.close()
})
