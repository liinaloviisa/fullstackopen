import { useState } from 'react'

const Blog = ({ blog, deleteBlog, user }) => {
  const [visible, setVisible] = useState(false) // tila yksityiskohtien näkyvyydelle

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const handleDelete = () => {
    if (window.confirm(`Delete blog "${blog.title}" by ${blog.author}?`)) {
      deleteBlog(blog.id)
    }
  }

  return (
    <div style={{ border: '1px solid black', padding: 5, marginBottom: 5 }}>
      <div>
        {blog.title} {blog.author}
        <button onClick={toggleVisibility} style={{ marginLeft: 10 }}>
          {visible ? 'hide' : 'view'}
        </button>
      </div>

      {visible && (
        <div style={{ marginTop: 5 }}>
          <div>{blog.url}</div>
          <div>likes {blog.likes}</div>
          {blog.user && (
            <div>{blog.user.name || blog.user.username}</div>
          )}
          {blog.user && user && blog.user.id === user.id && (
            <button onClick={handleDelete}>delete</button>
          )}
        </div>
      )}
    </div>
  )
}

export default Blog