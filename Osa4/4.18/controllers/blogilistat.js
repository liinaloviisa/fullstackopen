const blogRouter = require('express').Router()
const Blog = require('../models/blogilista')
const User = require('../models/user')

blogRouter.get('/', async (request, response, next) => {
  try {
    const blogs = await Blog.find({}).populate('user', {
      username: 1,
      name: 1,
      _id: 1
    })
    response.json(blogs)
  } catch (error) {
    next(error)
  }
  /*Blog.find({}).then((blogs) => {
    response.json(blogs)
  })
  .catch(error => next(error))*/
})

blogRouter.post('/', async (request, response, next) => {
  //const blog = new Blog(request.body)
  const body = request.body

  const user = await User.findById(body.userId)

  if (!user) {
    return response.status(400).json({ error: 'userId missing or not valid' })
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)

  /*blog.save().then((result) => {
    response.status(201).json(result)
  })
  .catch(error => next(error))*/
})

blogRouter.delete('/:id', async (request, response, next) => {
  try {
    const deleted = await Blog.findByIdAndDelete(request.params.id)

    if (!deleted) {
      return response.status(404).json({ error: 'blog is not found'})
    }

    return response.status(204).end()
  } catch (error) {
    next(error)
  }
})

module.exports = blogRouter