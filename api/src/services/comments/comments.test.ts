import { comments, createComment } from './comments'
import type { PostOnlyScenario, StandardScenario } from './comments.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float and DateTime types.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('comments', () => {
  scenario('returns all comments', async (scenario: StandardScenario) => {
    const result = await comments()

    expect(result.length).toEqual(Object.keys(scenario.comment).length)
  })

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
})
