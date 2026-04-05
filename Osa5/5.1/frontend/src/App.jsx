import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newBlog, setNewBlog] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
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
    }
  }, [])

  const addBlog = event => {
    event.preventDefault()
    const blogObject = {
      title: newBlog.title,
      author: user.username,
      url: newBlog.url,
      likes: newBlog.likes,
      user: {
        //type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    }

    blogService.create(blogObject).then(returnedBlog => {
      setBlogs(blogs.concat(returnedBlog))
      setUser({
        ...user,
        blogs: user.blogs.concat(returnedBlog)
      })
      setNewBlog('')
    })
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
      const userBlogs = allBlogs.filter(blog => blog.user && blog.user.id == user.id)
      setUser({
        ...user,
        blogs: userBlogs
      })
      setUsername('')
      setPassword('')
    } catch {
      setErrorMessage('wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  /*const handleBlogChange = event => {
    setNewBlog(event.target.value)
  }*/

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        <label>
          username
          <input
            type="text"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          password
          <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </label>
      </div>
      <button type="submit">login</button>
    </form>
  )

  const blogForm = () => (
    <form onSubmit={addBlog}>
      {/*<input value={newBlog} onChange={handleBlogChange} />
      <button type="submit">save</button>*/}
    </form>
  )

  const handleLogout = () => {
    setUser(null)
    window.localStorage.removeItem("loggedBlogappUser")
  }

  return (
    <div>
      <h1>Login</h1>
      <Notification message={errorMessage} />
      {!user && loginForm()}
      {user && (
      <div>
        <p>{user.name} logged in <button type="button"onClick={handleLogout}>logout</button></p>
        {blogForm()}
        {(user.blogs || []).map(blog => (
          <Blog key={blog.id} blog={blog} />
        ))}
      </div>
    )}

    </div>
  )
}

export default App