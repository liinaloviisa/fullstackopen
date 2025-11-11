import axios from 'axios'
//const baseUrl = 'http://localhost:3001/persons'
const baseUrl = '/api/persons'

const getAll = () => {
  return axios.get(baseUrl)
}

const create = newObject => {
  return axios.post(baseUrl, newObject)
}

const update = (id, updatedObject) => {
  return axios.put(`${baseUrl}/${id}`, updatedObject).then(response => response.data)
}

const remove = id =>
  axios.delete(`/api/persons/${id}`)

export default { 
  getAll: getAll, 
  create: create,
  remove: remove, 
  update: update 
}