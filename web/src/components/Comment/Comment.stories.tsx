import Comment from './Comment'

const COMMENT = {
  name: 'Rob Cameron',
  body: 'This is the first comment!',
  createdAt: '2020-01-01T12:34:56Z',
  id: 1,
  postId: 1,
}

export const defaultView = () => {
  return <Comment comment={COMMENT} />
}

export const moderatorView = () => {
  mockCurrentUser({
    roles: 'moderator',
    id: 1,
    email: 'moderator@moderator.com',
    name: 'Mr, Moderator',
  })
  return (
    <div className="m-4">
      <Comment comment={COMMENT} />
    </div>
  )
}

export default { title: 'Components/Comment' }
