// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import UserPost from '../../types/user_post'
const dbc = require('../../db/conn')


export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Array<string>>
) {

  // todo: Authenticate User

  let payload: UserPost = req.body

  // Get User's Post from MongoDB
  const dbConnection = dbc.getDb();

  dbConnection
    .collection('UserPosts')
    .find({
      user_sequencial_id: payload.user_sequencial_id
    })
    .toArray((err: any, results: Array<string>) => {
      if (err) {
        res.status(400).send(["error fetching posts"])
      }
      else {
        res.status(200).json(results)
      }
    });
}
