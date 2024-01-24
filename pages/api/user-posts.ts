// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { UserNote, UserNoteType } from '../../model/user-note.model'
import connectDb from '../../lib/connectDb'
import { withApiAuthRequired } from '@auth0/nextjs-auth0';
import { getSession } from '@auth0/nextjs-auth0';

export default withApiAuthRequired( async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Array<UserNoteType> | UserNoteType>
) {
  try {
    const user = await getSession(req, res); // todo, use this user to make db requests
    console.log(`user: ${JSON.stringify(user)}`)

    if (req.method === "GET") {

      if (req.query && req.query['email']) {

        await connectDb()

        let pastUserNotes = await UserNote.find({"email": req.query['email']})
        res.status(200).json(pastUserNotes)
      }
    }
    else {
      res.status(501)
    }
    
  } catch (error: any) {
    console.log("error: ", error)
    res.status(400).send(error)
  }
})