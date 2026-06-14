import { useState, useEffect } from 'react'
import Persons from './components/Persons'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
//import {createConnection} from '../db'
import axios from 'axios'
import personService from './services/persons'

const App = () => {

  //const [serverUrl] = useState('http://localhost:3001/persons')

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

 

  const addNameAndNumber = (event) => {
    event.preventDefault()
    console.log('button clicked', event.target)
    const nameObject = {
      name: newName,
      number: newNumber
    }

    var nameNotExist= true

    persons.forEach((person) => {
    //debugger
      if (person.name === newName) {
        alert(`${newName} is already added to phonebook`)
        nameNotExist = false
      }   
    });

    if (nameNotExist) {
      setPersons(persons.concat(nameObject))
      setNewName(newName)
    }

    personService
    .create(nameObject)
    .then(response => {
      setPersons(persons.concat(response.data))
      setNewName('')
    })

    /**axios
      .post('http://localhost:3001/persons', nameObject)
      .then(response => {
        console.log(response)
      })
        **/
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

  /*const listPersons = () => {
    return persons.map(person => (
      <div key={person.name}>{person.name} {person.number}</div>
    )); 
  }*/


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

  }

  return (
    <div>
      <h2>Phonebook</h2>
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
      
      <div>debug: {newName}</div>
      ...
    </div>
  )

}

export default App