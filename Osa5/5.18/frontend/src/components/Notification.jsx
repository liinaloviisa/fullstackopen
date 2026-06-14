const Notification = ({ message, type }) => {
  if (message === null) {
    return null
  }

  return (
    <div style={{
      color: type === 'blog' ? 'green' : 'red',
      background: type === 'blog' ? '#d4edda' : '#f2dede',
      border: type === 'blog' ? '#28a745' : 'red',
      borderStyle: 'solid',
      borderWidth: 5,
      padding: 10,
      borderRadius: 5,
      marginBottom: 15
    }}>
      {message}
    </div>
  )
}

export default Notification