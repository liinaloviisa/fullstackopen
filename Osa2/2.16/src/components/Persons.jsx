const Persons = ({ personsToShow, handleDelete}) => (
  /*const update = (id, newObject) => {
    return axios.put(`http://localhost:3001/persons/${id}`, newObject)
  }*/
  
  <div>
    {personsToShow.map(person => (
      <div key={person.id}>
        {person.name} {person.number}
        <button onClick={() => handleDelete(person.id)}>delete</button>
      </div>
    ))}
  </div>
);

export default Persons