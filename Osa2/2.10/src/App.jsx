import { useState } from 'react'
import Persons from './components/Persons'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', 
      number: '040-1231244'
    },
    { name: 'Aku Ankka', 
      number: '040-1231245'
    }
  ]) 
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
    debugger
      if (person.name === newName) {
        alert(`${newName} is already added to phonebook`)
        nameNotExist = false
      }   
    });

    if (nameNotExist) {
      setPersons(persons.concat(nameObject))
      setNewName(newName)
    }
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

  const personsListed = listPersons()

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
      
      <Persons personsToShow={personsToShow} />
      
      <div>debug: {newName}</div>
      ...
    </div>
  )

}

export default App