type UserPost = {
  user_sequencial_id: number,
  user_uuid: string,
  message: string | Array<string>,
  date: Date,
  tags: Array<string>,
  post_id: string
}

export default UserPost;