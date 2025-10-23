import { useState } from 'react'

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
  const [showAll, setShowAll] = useState(true)

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

  const namesToShow = showAll
    ? persons
    : persons.filter(person => person.name === newName)

  const listPersons = () => {
    return persons.map(person => (
      <div key={person.name}>{person.name} {person.number}</div>
    ));
  }

  const personsListed = listPersons()

  return (
    <div>
      <h2>Phonebook</h2>
      <div>
        filter shown with
        <input
        onChange={namesToShow}>
        </input></div>
      <form onSubmit={addNameAndNumber}>
        <div>
          name:
          <input 
            value={newName} 
            onChange={handleNameAdd}
          />
        <div>
          number: 
          <input 
            value={newNumber} 
            onChange={handleNumberAdd} />
        </div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <div>{personsListed}</div>
      <div>debug: {newName}</div>
      ...
    </div>
  )

}

export default App