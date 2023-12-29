type UserPost = {
  user_sequencial_id: number,
  user_uuid: string,
  message: string | Array<string>,
  date: Date,
  tags: Array<string>,
  location: object,
  city_country: string,
  post_id: string
}

export default UserPost;