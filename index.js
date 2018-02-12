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


let persons = [ 
  {
    "name": "Arto Hellas",
    "number": "040-123456",
    "id": 1
  },
  {
    "name": "Martti Tienari",
    "number": "040-123456",
    "id": 2
  },
  {
    "name": "Arto Järvinen",
    "number": "040-123456",
    "id": 3
  },
  {
    "name": "Lea Kutvonen",
    "number": "040-123456",
    "id": 4
  }
]



let koko = persons.length
let date = new Date()

function generateRandomInteger(min =5 , max = 100000000000000000000){
    return Math.floor(Math.random() * (max -min)) + min
}

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/info', (req, res) => {
    res.send(`<p>Puhelinluettelossa ${koko} henkilön tiedot</p> <br></br> ${date}`)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number (req.params.id)
    console.log(id)
    const person = persons.find(person => person.id === id)

    if (person) {
    res.json(person)
    } else {
        res.status(404).end()
    }
})

app.post('/api/persons', (req, res) => {
    const body = req.body

    if (body.number === undefined || body.name === undefined) {
        return res.status(400).json({error: 'Nimi tai numero puuttuu!'})
    }

    const person = {
        name: body.name,
        number: body.number,
        id: generateRandomInteger()
    }

    const existingUser = persons.find(person => person.name === body.name)

    if (existingUser !== undefined) {
        return res.status(400).json({error: 'Nimen pitää olla uniikki!'})
    }

    persons = persons.concat(person)
    
    res.json(person)

})

const error = (req, res) => {
    res.status(404).send({error: 'unknown endpoint'})
}
app.use(error)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
