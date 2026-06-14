import { useState, useEffect } from 'react'
import Persons from './components/Persons'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
//import {createConnection} from '../db'
import axios from 'axios'
import personService from './services/persons'
import Notification from './components/Notification'

const App = () => {

  const [persons, setPersons] = useState([])

  useEffect(() => {
    personService
    .getAll()
      .then(response => {
        setPersons(response.data)
      })
  }, []);

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('');
  const [notificationMessage, setNotificationMessage] = useState(null)


  const addNameAndNumber = (event) => {
    event.preventDefault()

    const existingPerson = persons.find(
      p => p.name === newName
    )

    const nameObject = {
      name: newName,
      number: newNumber
    }

    if (existingPerson) {
      const confirmUpdate = window.confirm(
        `${newName} is already in phonebook. Replace the old number?`
      )

      if (!confirmUpdate) return

      const changedPerson = {
        ...existingPerson,
        number: newNumber
      }

      personService
        .update(existingPerson.id, changedPerson)
        .then(response => {
          setPersons(persons.map(p =>
            p.id !== existingPerson.id ? p : response.data
          )
        )

        setNotificationMessage(`Updated ${response.data.name}`)
        setTimeout(() => setNotificationMessage(null), 3000)
      })
      setNewName('')
      setNewNumber('') 

      return

    }

    personService
      .create(nameObject)
      .then(response => {
        setPersons(persons.concat(response.data))

        setNotificationMessage(`Added ${response.data.name}`)
        setTimeout(() => setNotificationMessage(null), 3000)

      })
      setNewName('')
      setNewNumber('')
    
    }

  const handleNameAdd = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberAdd = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  }

  const personsToShow = filter
    ? persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))
    : persons;


  const handleDelete = (id) => {
    const person = persons.find(p => p.id === id)

    const confirmDelete = window.confirm(
      `Delete ${person.name}?`
    )

    if (!confirmDelete) {
      return
    }
    
    axios
    .delete(`http://localhost:3001/persons/${id}`)
    .then(() => {
      setPersons(persons.filter(person => person.id !== id))
    })

    setNotificationMessage(`Deleted ${person.name}`)
    
      setTimeout(() => {
        setNotificationMessage(null)
      }, 3000)

  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notificationMessage} />
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      <PersonForm
        newName={newName}
        handleNameChange={handleNameAdd}
        newNumber={newNumber}
        handleNumberChange={handleNumberAdd}
        handleSubmit={addNameAndNumber}
      />

      <h2>Numbers</h2>
      
      <Persons personsToShow={personsToShow} handleDelete={handleDelete}/>

    </div>
  )

}

export default App