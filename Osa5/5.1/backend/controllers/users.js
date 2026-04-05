const bcryptjs = require('bcryptjs')
const usersRouter = require('express').Router()
const User = require('../models/user')
const Blog = require('../models/blogilista')

usersRouter.get('/', async (request, response, next) => {
  /*const users = await User
    .find({}).populate('blogs', {username: 1, name: 1})

  response.json(users)*/

  try {
    const users = await User.find({}).populate('blogs', {
      title: 1,
      author: 1,
      url: 1,
      likes: 1,
      id: 1
    })
    response.json(users)
  } catch (error) {
    next(error)
  }  
  //})
  //.catch(error => next(error))
})

usersRouter.post('/', async (request, response) => {
  /*const { username, name, password } = request.body

  const saltRounds = 10
  const passwordHash = await bcryptjs.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)*/

  //////
  const body = request.body

  const blog = await Blog.findById(body.blogId)

  if (!blog) {
    return response.status(400).json({ error: 'userId missing or not valid' })
  }

  const user = new User({
    username: body.username,
    name: body.name,
    blog: blog._id
  })

  const savedUser = await user.save()
  blog.user = blog.user.concat(savedUser._id)
  await blog.save()

  response.status(201).json(savedUser)
})

module.exports = usersRouter