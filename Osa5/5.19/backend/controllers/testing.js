const router = require('express').Router()
const Blog = require('../models/blogilista')
const User = require('../models/user')

router.post('/reset', async (req, res) => {

  console.log('Resetting the database...')
  await Blog.deleteMany({})
  console.log('All blogs deleted.')

  await User.deleteMany({})
  console.log('All users deleted.')
  res.status(204).end()
})

module.exports = router

