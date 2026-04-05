const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

const emptyBlogs = []
const oneBlog = {
  title: "aaa",
  author: "bbb",
  url: "ccc",
  likes: 1
}

const twoBlogs = [
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

describe('total likes', () => {
  test('of empty list is zero', () => {
    assert.strictEqual(emptyBlogs.length, 0)
  })
  test('when list has only one blog equals the likes of that', () => {
    assert.strictEqual(oneBlog.likes, 1)
  })
  test('of a blogger list is calculated right', () => {
    const totalLikes = twoBlogs.reduce((sum, blog) => sum + blog.likes, 0)
    assert.strictEqual(totalLikes, 3)
  })
})