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
  /*const [showAll, setShowAll] = useState(true)*/
  const [filter, setFilter] = useState('')

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const addNameAndNumber = (event) => {
    event.preventDefault()
    console.log('button clicked', event.target)
    const nameObject = {
      name: newName,
      number: newNumber
    }

    var nameNotExist= true

    persons.forEach((person) => {
      if (person.name === newName) {
        alert(`${newName} is already added to phonebook`)
        nameNotExist = false
      }   
    });

    if (nameNotExist) {
      setPersons(persons.concat(nameObject))
      setNewName('')
      setNewNumber('')
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

  const namesToShow = persons.filter(person => 
    person.name.toLowerCase().includes(filter.toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>
      <div>
        filter shown with
        <input 
          value={filter} 
          onChange={handleFilterChange}
        />
        </div>
      <h3>add a new</h3>
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
      <div>  
        {namesToShow.map(person => (
          <div key={person.name}>
            {person.name} {person.number}
          </div>
        ))}
      </div>
    </div>
  )

}

export default App