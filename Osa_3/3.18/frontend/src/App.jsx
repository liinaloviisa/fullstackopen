import { useState, useEffect } from 'react'
import Persons from './components/Persons'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import axios from 'axios'
import personService from './services/persons'

const App = () => {

  const [serverUrl] = useState('http://localhost:3001/api/persons')

  const [persons, setPersons] = useState([])

  useEffect(() => {
    personService
    .getAll()
    .then(response => {
      console.log('response.data:', response.data)
      setPersons(response.data)
    })
    .catch(error => {
      console.error('Something went wrong :(', error);
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

    const personExists = persons.find(p => p.name === newName)

    if (personExists) {
      //const updatedPerson = { ...personExists, number: newNumber}
      personService
        .update(personExists.id, {number: newNumber})
        .then(returnedPerson => {
        //const newPerson = response.data
          console.log('Person modified:', returnedPerson)
          setPersons(persons.map(p => p.id !== personExists.id ? p : returnedPerson))
          setNewName('')
          setNewNumber('')
        })
        .catch(error => {
          console.log(error)
        })
    } else {
      personService
        .create(nameObject)
        .then(returnedPerson => {
          //const newPerson = response.data
          console.log('Person added:', returnedPerson)
          //setPersons(persons.concat(newPerson))
          //setPersons(persons.concat(response.data))
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
      })
    }
    //persons.forEach((person) => {
    //debugger
      //if (person.name === newName) {
        //alert(`${newName} is already added to phonebook`)
        //nameNotExist = false


      //}   
    //});

    /*if (nameNotExist) {

    } */



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

  const listPersons = () => {
    return persons.map(person => (
      <div key={person.name}>{person.name} {person.number}</div>
    )); 
  }

  const handleDelete = (id) => {
    personService
    .remove(id)
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