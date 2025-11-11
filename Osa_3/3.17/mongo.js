const mongoose = require('mongoose')
const PhoneNumber = require('./backend/models/number')

if (process.argv.length < 3) {
  console.log('Give at least password as argument. You may optionally add also name and number as arguments')
  process.exit(1)
}

if (process.argv.length == 4) {
  console.log('Give name and number as separate arguments using "" if spaces')
  process.exit(1)
}

if (process.argv.length > 5) {
  console.log('Too many arguments!')
  process.exit(1)
}

const password = process.argv[2]
const argName = process.argv[3]
const argNumber = process.argv[4]

//const url = `mongodb+srv://liinaloviisa:${password}@cluster312.s1cdhla.mongodb.net/PhoneNumbers?retryWrites=true&w=majority&appName=Osa3.12`
const url = process.env.MONGODB_URI
mongoose.set('strictQuery', false)
mongoose.connect(url)

const numberSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Number = mongoose.model('Number', numberSchema)

const newNumber = new Number({
  name: argName,
  number: argNumber
})

if (process.argv.length == 5) {
  newNumber.save()
    .then(() => {
      console.log(`added ${argName} number ${argNumber} to phonebook`)
      mongoose.connection.close()
  })
}

if (process.argv.length == 3) {
  console.log('phonebook:')
  Number.find({})
    .then(result => {
      result.forEach(number => {
        console.log(number.name, " ", number.number)
      })
      mongoose.connection.close()
  })
}
