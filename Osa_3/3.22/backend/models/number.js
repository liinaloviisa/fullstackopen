const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to MongoDB')
mongoose.connect(url)

  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const numberSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true
  },
  number: {
    type: String,
    minlength: 9,
    validate: {
      validator: function(v) {
        //return /\d{3}-\d{5}|\d{2}-\d{6}/.test(v)
        return /^\d{2,3}-\d+$/.test(v)
      },
      message: 'Phone number must be at least 8 characters long and consist of two parts, of which the first part should be 2 or 3 characters'
    },
    required: [true, 'Phone number must be at least 8 characters long and consist of two parts, of which the first part should be 2 or 3 characters']
  }
})

numberSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})


module.exports = mongoose.model('PhoneNumber', numberSchema, 'numbers')