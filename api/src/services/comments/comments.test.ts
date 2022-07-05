import { AuthenticationError, ForbiddenError } from '@redwoodjs/graphql-server'

import { db } from 'src/lib/db'

import { comments, createComment, deleteComment } from './comments'
import type { PostOnlyScenario, StandardScenario } from './comments.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float and DateTime types.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('comments', () => {
  scenario(
    'returns all comments for a single post from the database',
    async (scenario: StandardScenario) => {
      const result = await comments({ postId: scenario.comment.jane.postId })

      const post = await db.post.findUnique({
        where: { id: scenario.comment.jane.postId },
        include: { comments: true },
      })
      expect(result.length).toEqual(post.comments.length)
    }
  )

  scenario(
    'postOnly',
    'create a new comment',
    async (scenario: PostOnlyScenario) => {
      const comment = await createComment({
        input: {
          name: 'Jane Doe',
          body: 'I like trees',
          postId: scenario.post.bark.id,
        },
      })

      expect(comment.name).toEqual('Jane Doe')
      expect(comment.body).toEqual('I like trees')
      expect(comment.postId).toEqual(scenario.post.bark.id)
      expect(comment.createdAt).not.toEqual(null)
    }
  )

  scenario(
    'allow a moderator to delete a comment',
    async (scenario: StandardScenario) => {
      mockCurrentUser({
        roles: 'moderator',
        id: 1,
        email: 'moderator@moderator.com',
        name: 'Moderator',
      })

      const comment = await deleteComment({ id: scenario.comment.jane.id })
      expect(comment.id).toEqual(scenario.comment.jane.id)

      const result = await comments({ postId: scenario.comment.jane.postId })
      expect(result.length).toEqual(0)
    }
  )

  scenario(
    'does not allow a none moderator to delete a comment',

    async (scenario: StandardScenario) => {
      mockCurrentUser({
        roles: 'user',
        id: 1,
        email: 'user@user.com',
        name: 'user',
      })

      expect(() => deleteComment({ id: scenario.comment.jane.id })).toThrow(
        ForbiddenError
      )
    }
  )

  scenario(
    'does not allow a logged out user to delete a comment',
    async (scenario: StandardScenario) => {
      mockCurrentUser(null)

      expect(() =>
        deleteComment({
          id: scenario.comment.jane.id,
        })
      ).toThrow(AuthenticationError)
    }
  )
})
