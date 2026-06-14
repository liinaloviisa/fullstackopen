import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import BlogForm from './components/BlogForm'

const App = () => {
  const [loginVisible, setLoginVisible] = useState(false)
  const [blogs, setBlogs] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)
  const [blogMessage, setBlogMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    if(user)
      blogService.getAll().then(blogs =>
        setBlogs( blogs )
      )
  }, [user])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)

      blogService.getAll().then(allBlogs => {
        const userBlogs = allBlogs.filter(blog => blog.user && blog.user.id === user.id)
        setBlogs(userBlogs)
      })
    }

  }, [])

  const addBlog = (blogObject) => {
    blogService.create(blogObject).then(returnedBlog => {
      setBlogs(blogs.concat(returnedBlog))

      setBlogMessage(`a new blog "${returnedBlog.title}" added`)
      setTimeout(() => setBlogMessage(null), 5000)
    })
  }

  const deleteBlog = async (id) => {
    try {
      await blogService.remove(id)
      setBlogs(blogs.filter(blog => blog.id !== id))
    } catch (error) {
      console.error('Failed to delete blog', error)
    }
  }

  const handleLogin = async event => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      const allBlogs = await blogService.getAll()
      const userBlogs = allBlogs.filter(blog => blog.user && blog.user.id === user.id)
      setUser({
        ...user,
        blogs: userBlogs
      })
      setUsername('')
      setPassword('')
    } catch {
      setErrorMessage('wrong username or password')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const updateBlog = (returnedBlog) => {
    setBlogs(blogs.map(blog =>
      blog.id === returnedBlog.id ? returnedBlog : blog
    ))
  }

  const loginForm = () => {
    const hideWhenVisible = { display: loginVisible ? 'none' : '' }
    const showWhenVisible = { display: loginVisible ? '' : 'none' }

    return (
      <div>
        <div style={hideWhenVisible}>
          <button onClick={() => setLoginVisible(true)}>log in</button>
        </div>
        <div style={showWhenVisible}>
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
          <button onClick={() => setLoginVisible(false)}>cancel</button>
        </div>
      </div>
    )
  }

  const handleLogout = () => {
    setUser(null)
    window.localStorage.removeItem('loggedBlogappUser')
  }

  return (
    <div>
      {user && <h1>blogs</h1>}
      {!user && <h1>log in to application</h1>}
      <Notification message={errorMessage} type="error" />
      {!user && loginForm() }
      <Notification message={blogMessage} type="blog"/>
      {user && (
        <div>
          <p>{user.name} logged in <button type="button"onClick={handleLogout}>logout</button></p>
          <h2>create new</h2>
          <BlogForm createBlog={addBlog} />
          {user &&
          [...blogs].sort((a, b) => b.likes - a.likes).map(blog => (
            <Blog
              key={blog.id}
              blog={blog}
              updateBlog={updateBlog}
              deleteBlog={deleteBlog}
              user={user}/>
          ))
          }
        </div>
      )}

    </div>
  )
}

export default App