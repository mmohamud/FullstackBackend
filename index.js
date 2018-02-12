const Person = require('./models/person')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

app.use(cors())
app.use(bodyParser.json())
app.use(express.static('build'))


morgan.token('data', function (req, res) {
    return JSON.stringify(req.body)
})

app.use(morgan(':method :url :data :status :res[content-length] - :response-time ms'))



//let persons = [ 
//    {
//    "name": "Arto Hellas",
//    "number": "040-123456",
//    "id": 1
//  },
//  {
//    "name": "Martti Tienari",
//    "number": "040-123456",
//    "id": 2
//  },
//  {
//    "name": "Arto Järvinen",
//    "number": "040-123456",
//    "id": 3
//  },
//  {
//    "name": "Lea Kutvonen",
//    "number": "040-123456",
//   "id": 4
//  }
//]

//let koko = persons.length
//let date = new Date()

function generateRandomInteger(min =5 , max = 100000000000000000000){
    return Math.floor(Math.random() * (max -min)) + min
}

const formatPerson = (person) => {
    return {
        name: person.name,
        number: person.number,
        id: person._id
    }
}

app.get('/api/persons', (req, res) => {
    Person
        .find({})
        .then(persons => {
        res.json(persons.map(Person.format))
        })
})

app.get('/info', (req, res) => {
    Person
        .find({})
        .then(persons => {
        res.send(`<p>Puhelinluettelossa ${persons.length} henkilön tiedot</p> <br></br> ${new Date()}`)
        })
})

app.get('/api/persons/:id', (req, res) => {
    //const id = Number (req.params.id)
    //console.log(id)
    //const person = persons.find(person => person.id === id)

    //if (person) {
    //res.json(Persons.format(person))
    //} else {
    //    res.status(404).end()
    //}

    Person
        .findById(req.params.id)
        .then(person => {
            res.json(Person.format(person))
        })
})

app.post('/api/persons', (req, res) => {
    const body = req.body

    if (body.number === undefined || body.name === undefined) {
        return res.status(400).json({error: 'Name or number missing!'})
    }

    const person = new Person({
        name: body.name,
        number: body.number
        //id: generateRandomInteger()
    })

    Person
        .find({name: person.name})
        .then(result => {
            if (result.length > 0) {
                res.status(409).send({error: 'Name already exists'})
            
            } else {

    person
        .save()
        .then(savedPerson => {
            res.json(Person.format(savedPerson))
        })
    }

    //const existingUser = persons.find(person => person.name === body.name)

    //if (existingUser !== undefined) {
    //    return res.status(400).json({error: 'Nimen pitää olla uniikki!'})
    //} 
        //person
          //  .save()
          //  .then(savedPerson => {
          //      response.json(formatPerson(savedPerson))
          //  })
    

    //persons = persons.concat(person)   
    //res.json(person)

})
})
app.delete('/api/persons/:id', (req, res) => {
    Person
        .findByIdAndRemove(req.params.id)
        .then(result => {
            res.status(204).end()
        })
        .catch(error => {
            res.status(400).send({error: 'malformatted id'})
        })
})

app.put('/api/persons/:id', (req, res) => {
    const body = req.body

    const person = {
        name: body.name,
        number: body.number
    }

    Person
        .findByIdAndUpdate(req.params.id, person, { new: true })
        .then(updatedPerson => {
            res.json(Person.format(updatedPerson))
        })
        .catch(error => {
            console.log(error)
            res.status(400).send({ error: 'Malformatted id' })
        })

})

const error = (req, res) => {
    res.status(404).send({error: 'unknown endpoint'})
}
app.use(error)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
