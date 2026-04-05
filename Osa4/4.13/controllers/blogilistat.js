const blogRouter = require('express').Router()
const Blog = require('../models/blogilista')

blogRouter.get('/', (request, response, next) => {
  Blog.find({}).then((blogs) => {
    response.json(blogs)
  })
  .catch(error => next(error))
})

blogRouter.post('/', (request, response, next) => {
  const blog = new Blog(request.body)

  blog.save().then((result) => {
    response.status(201).json(result)
  })
  .catch(error => next(error))
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