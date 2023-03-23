const mongoose = require('mongoose')


if (process.argv.length != 3 && process.argv.length != 5) {
  console.log('Usage: node mongo.js <password> [<person_name> <person_number>]')
  process.exit(0)
}

const password = process.argv[2]
const connectionUrl =
  `mongodb+srv://test_user:${password}@cluster1.ru9fsrn.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.connect(connectionUrl)
  .then(() => console.log('connected'))

const personSchema = mongoose.Schema({
  name: String,
  number: Number
})

// the Person model based on the personSchema
const Person = mongoose.model('Person', personSchema)

if (process.argv.length == 3) {
  // list all the persons
  Person.find({})
    .then((persons) => {
      console.log(`phonebook:`)
      persons.forEach(person => {
        console.log(`${person.name} ${person.number}`)
      })
      mongoose.connection.close()
    })
} else {
  // add a person
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4]
  })

  person.save()
    .then((result) => {
      console.log(`added ${person.name} number ${person.number} to phonebook`)
      mongoose.connection.close()
    })
}
