const mongoose = require('mongoose')

const url = 'mongodb://fullstack:sekred@ds127888.mlab.com:27888/fullstackback'

mongoose.connect(url)

const Person = mongoose.model('Person', {
  name: String,
  number: String
})

if (process.argv.length === 4) {
  const person = new Person({
    name: process.argv[2],
    number: process.argv[3]
  })

  person
    .save()
    .then(response => {
      console.log(`lisätään henkilö ${person.name} numero ${person.number} luetteloon`)
      mongoose.connection.close()
    })
} else {

Person
  .find({})
  .then(result => {
    console.log('puhelinluettelo:')
    result.forEach(person => {     
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
}
