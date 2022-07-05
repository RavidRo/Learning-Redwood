import { Comment as IComment } from 'types/graphql'

import { useAuth } from '@redwoodjs/auth'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/dist/toast'

import { QUERY as CommentsQuery } from 'src/components/CommentsCell'

const formattedDate = (datetime: ConstructorParameters<typeof Date>[0]) => {
  const parsedDate = new Date(datetime)
  const month = parsedDate.toLocaleString('default', { month: 'long' })
  return `${parsedDate.getDate()} ${month} ${parsedDate.getFullYear()}`
}

const DELETE_COMMENT_QUERY = gql`
  mutation DeleteCommentMutation($id: Int!) {
    deleteComment(id: $id) {
      id
    }
  }
`

interface Props {
  comment: Pick<IComment, 'id' | 'name' | 'body' | 'createdAt' | 'postId'>
}

const Comment = ({ comment }: Props) => {
  const [deleteComment] = useMutation(DELETE_COMMENT_QUERY, {
    refetchQueries: [
      { query: CommentsQuery, variables: { postId: comment.postId } },
    ],
  })
  const { hasRole } = useAuth()
  const moderate = () => {
    if (confirm('Are you sure you want to delete this comment?')) {
      deleteComment({ variables: { id: comment.id } }).then(() => {
        toast('Comment deleted.')
      })
    }
  }
  return (
    <div className="bg-gray-200 p-8 rounded-lg relative">
      <header className="flex justify-between">
        <h2 className="font-semibold text-gray-700">{comment.name}</h2>
        <time className="text-xs text-gray-500" dateTime={comment.createdAt}>
          {formattedDate(comment.createdAt)}
        </time>
      </header>
      <p className="text-sm mt-2">{comment.body}</p>
      {hasRole('moderator') && (
        <button
          type="button"
          onClick={moderate}
          className="absolute bottom-2 right-2 bg-red-500 text-xs rounded text-white px-2 py-1"
        >
          Delete
        </button>
      )}
    </div>
  )
}

export default Comment
