// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { UserNote, UserNoteType } from '../../model/user-note.model'
import { Types, connect } from 'mongoose';
import { withApiAuthRequired } from '@auth0/nextjs-auth0';
const { MongoClient, ServerApiVersion } = require('mongodb');


export default withApiAuthRequired( async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Array<UserNoteType> | UserNoteType>
) {
  try {

    if (req.method == "POST") {

      console.log("req: ", req.body)
      // validate data comming in
      if (req.body && req.body['email'] && req.body['note'] && req.body['tags']) {

        await connect(process.env.MONGO_URL ? process.env.MONGO_URL : "")
        var userNote = new UserNote({
          user_uuid: new Types.ObjectId(),
          email: req.body['email'],
          note: req.body['note'],
          date: Date.now(),
          post_id: new Types.ObjectId(),
          tags: req.body['tags'],
        })
        await userNote.save();
        res.status(200).json(userNote)
        
      }
      else {
        res.status(400)
      }
    }
    else if (req.method === "GET") {

      if (req.query && req.query['email']) {
        await connect(process.env.MONGO_URL ? process.env.MONGO_URL : "");
        let pastUserNotes = await UserNote.find({"email": req.query['email']})
        res.status(200).json(pastUserNotes)

      }
    }
    
  } catch (error: any) {
    console.log("error: ", error)
    res.status(400).send(error)
  }
})
