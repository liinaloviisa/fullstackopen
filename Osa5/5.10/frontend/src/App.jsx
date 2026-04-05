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
  /*const [newBlog, setNewBlog] = useState({
    title: '',
    author: '',
    url: ''
  })*/
  const [errorMessage, setErrorMessage] = useState(null)
  const [blogMessage, setBlogMessage] = useState(null)
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('') 
  const [user, setUser] = useState(null)
  //const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes)

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

  /*const addBlog = event => {
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
  }*/

  const addBlog = (blogObject) => {
  blogService.create(blogObject).then(returnedBlog => {
    setBlogs(blogs.concat(returnedBlog))

    setBlogMessage(`a new blog "${returnedBlog.title}" added`)
    setTimeout(() => setBlogMessage(null), 5000)
  })
}

    /*blogService.create(blogObject).then(returnedBlog => {
      setBlogs(blogs.concat(returnedBlog))
      setUser({
        ...user,
        blogs: (user.blogs || []).concat(returnedBlog)
      })
      setNewBlog({
        title: '',
        author: '',
        url: ''
      })
      setBlogMessage(`a new blog "${returnedBlog.title}" by ${returnedBlog.author} added`)
      setTimeout(() => {
        setBlogMessage(null)
      }, 5000)
    })
  }*/
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
      setErrorMessage('wrong username or password')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  /*const handleBlogChange = event => {
    const { name, value } = event.target
    setNewBlog({
    ...newBlog,
    [name]: value
  })
  }*/

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

  /*const blogForm = () => (
    <form onSubmit={addBlog} id="blogForm">
      <div>
        <label>
        title:
        <input 
          name="title"
          type="text"
          value={newBlog.title} 
          onChange={handleBlogChange} />
        </label>
      </div>
      <div>
        <label>
        author:
        <input 
          name="author"
          type="text"
          value={newBlog.author} 
          onChange={handleBlogChange} />
        </label>
      </div>
      <div>
        <label>
        url:
        <input 
          name="url"
          type="text"
          value={newBlog.url} 
          onChange={handleBlogChange} />
        </label>
      </div>
      <button type="submit">create</button>
    </form>
  )*/


  const handleLogout = () => {
    setUser(null)
    window.localStorage.removeItem("loggedBlogappUser")
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
            <Blog key={blog.id} blog={blog} updateBlog={updateBlog} />
          ))
        }
      </div>
    )}

    </div>
  )
}

export default App