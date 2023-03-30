const mongoose = require('mongoose')
const { transform } = require('typescript')

const url = process.env.MONGODB_URL

mongoose.connect(url)
  .then(result => {
    console.log('connected to mongodb')
  })
  .catch(error => {
    console.log('error in connecting ', error.message)
  })

const personSchema = mongoose.Schema({
  name: String,
  number: Number
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)


