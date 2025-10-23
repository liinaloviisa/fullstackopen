import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas' }
  ]) 
  const [newName, setNewName] = useState('')

  const addName = (event) => {
    event.preventDefault()
    console.log('button clicked', event.target)
    const nameObject = {
      name: newName
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

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={addName}>
        <div>
          name:
          <input 
            value={newName} 
            onChange={handleNameAdd}
            />
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <div>debug: {newName}</div>
      ...
    </div>
  )

}

export default App