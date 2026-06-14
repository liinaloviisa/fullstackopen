import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('renders only title and author', () => {
  const blog = {
    title: 'Test title',
    author: 'Test author',
    url: 'http://url.com',
    likes: 3
  }

  render(<Blog blog={blog} />)

  const titleElement = screen.getByText(/Test title/i)
  expect(titleElement).toBeInTheDocument()

  const authorElement = screen.getByText(/Test author/i)
  expect(authorElement).toBeInTheDocument()

  expect(screen.queryByText(/http:\/\/url.com/i)).toBeNull()
  expect(screen.queryByText(/likes 3/i)).toBeNull()
})

test('after clicking view, all information is visible', () => {
  const blog = {
    title: 'Test title 2',
    author: 'Test author 2',
    url: 'http://url2.com',
    likes: 4
  }

  render(<Blog blog={blog} />)

  const titleElement = screen.getByText(/Test title 2/i)
  expect(titleElement).toBeInTheDocument()

  const authorElement = screen.getByText(/Test author 2/i)
  expect(authorElement).toBeInTheDocument()

  expect(screen.queryByText('http://url2.com')).toBeNull()
  expect(screen.queryByText(/likes 3/i)).toBeNull()

  const viewButton = screen.getByText(/view/i)
  fireEvent.click(viewButton)

  const urlElement = screen.getByText('http://url2.com')
  expect(urlElement).toBeDefined()

  const likeElement = screen.getByText('likes 4')
  expect(likeElement).toBeDefined()

  expect(screen.getByText(/Test title/i)).toBeInTheDocument()
  expect(screen.getByText(/Test author/i)).toBeInTheDocument()
})

test('clicking the like button twice calls event handler twice', async () => {
  const blog = {
    title: 'Test title 3',
    author: 'Test author 3',
    url: 'http://url3.com',
    likes: 5
  }

  const addLike = vi.fn()

  render(
    <Blog blog={blog} handleLike={addLike} />
  )

  const user = userEvent.setup()
  const button = screen.getByText('like')
  await user.click(button)
  await user.click(button)

  expect(addLike.mock.calls).toHaveLength(2)
})