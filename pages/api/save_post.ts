// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import UserPost from '../../types/user_post'
const dbc = require('../../db/conn')


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Array<string>>
) {

  // Authenticate User

  let payload: UserPost = req.body

   // Save User's Post to MongoDB
   const dbConnection = dbc.getDb();

   let savedStatus = await dbConnection
     .collection('UserPosts')
     .insertOne(payload)
 
 
  console.log(`entryList: ${savedStatus}`)

  res.status(200).json(savedStatus)
}
