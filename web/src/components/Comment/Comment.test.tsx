import { render, screen, waitFor } from '@redwoodjs/testing/web'

import Comment from './Comment'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components
const COMMENT = {
  name: 'Rob Cameron',
  body: 'This is the first comment!',
  createdAt: '2020-01-01T12:34:56Z',
  postId: 1,
  id: 1,
}

describe('Comment', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<Comment comment={COMMENT} />)
    }).not.toThrow()
  })

  it("Shows comment's details", () => {
    render(<Comment comment={COMMENT} />)

    expect(screen.getByText(COMMENT.name)).toBeInTheDocument()
    expect(screen.getByText(COMMENT.body)).toBeInTheDocument()
    const dateExpect = screen.getByText('1 January 2020')
    expect(dateExpect).toBeInTheDocument()
    expect(dateExpect.nodeName).toEqual('TIME')
    expect(dateExpect).toHaveAttribute('datetime', COMMENT.createdAt)
  })

  it('does not render a delete button if user is logged out', async () => {
    render(<Comment comment={COMMENT} />)

    await waitFor(() =>
      expect(screen.queryByText('Delete')).not.toBeInTheDocument()
    )
  })

  it('renders a delete button if the user is a moderator', async () => {
    mockCurrentUser({
      roles: 'moderator',
      id: 1,
      email: 'moderator@moderator.com',
      name: 'Mr, Moderator',
    })

    render(<Comment comment={COMMENT} />)

    await waitFor(() => expect(screen.getByText('Delete')).toBeInTheDocument())
  })
})
