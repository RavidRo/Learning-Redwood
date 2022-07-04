export const schema = gql`
  type Comment {
    id: Int!
    name: String!
    body: String!
    createdAt: DateTime!
    post: Post!
    postId: Int!
  }

  type Query {
    comments: [Comment!]! @skipAuth
  }

  input CreateCommentInput {
    name: String!
    body: String!
    postId: Int!
  }

  input UpdateCommentInput {
    name: String
    body: String
    postId: Int
  }

  type Mutation {
    createComment(input: CreateCommentInput!): Comment! @skipAuth
    deleteComment(id: Int!): Comment! @requireAuth
  }
`
