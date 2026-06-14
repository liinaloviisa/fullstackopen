const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blogilista')

const api = supertest(app)
const assert = require('node:assert')

const initialBlogs = [
  {
  title: "aaa",
  author: "bbb",
  url: "ccc",
  likes: 1
  },
  {
  title: "ddd",
  author: "eee",
  url: "fff",
  likes: 2
  }
]

beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(initialBlogs[1])
  await blogObject.save()
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogilistat')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('blogs amount is correct', async () => {
    const response = await api.get('/api/blogilistat')

    assert.strictEqual(response.body.length, 2)
})

test('Id-field is correct', async () => {
    const response = await api.get('/api/blogilistat')

    response.body.forEach(item => {
      assert.ok(item.id, 'id field missing')
    })
})

test('Add blog', async () => {
  const newBlog = {
    title: "ggg",
    author: "hhh",
    url: "http://ggghhh.com",
    likes: 5
  }

  await api
    .post('/api/blogilistat')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await api.get('/api/blogilistat')

  assert.strictEqual(blogsAtEnd.body.length, 3) 

  const titles = blogsAtEnd.body.map(b => b.title)
  assert.ok(titles.includes('ggg'))
})

test('Delete blog', async () => {
  const blogsAtStart = await api.get('/api/blogilistat')
  const deleted = blogsAtStart.body[0]

  await api
    .delete(`/api/blogilistat/${deleted.id}`)
    .expect(204)

  const blogsAtEnd = await api.get('/api/blogilistat')

  assert.strictEqual(
    blogsAtEnd.body.length,
    blogsAtStart.body.length - 1
  )
  
  const ids = blogsAtEnd.body.map(b => b.id)
  assert.ok(!ids.includes(deleted.id))
})

after(async () => {
  await mongoose.connection.close()
})