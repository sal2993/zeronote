// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { UserNote, UserNoteType } from '../../model/user-note.model'
// const dbc = require('../../db/conn')
import { Types, connect } from 'mongoose';
import { withApiAuthRequired } from '@auth0/nextjs-auth0';


export default withApiAuthRequired( async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Array<UserNoteType> | UserNoteType>
) {

  try {

    console.log("/api/user-posts called.... method: ", req.method)

    if (req.method == "POST") {

      console.log("req: ", req.body)
    
      // validate data comming in
      if (req.body && req.body['email'] && req.body['note'] && req.body['tags']) {


        await connect(process.env.MONGO_URL ? process.env.MONGO_URL : "")
        // mongodb://root:pass12345@localhost:27017

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
      console.log("GET user posts called")
      console.log(`the query: ${JSON.stringify(req.query)}`)

      if (req.query && req.query['email']) {
        console.log("   you are using an email for sure..")
        await connect(process.env.MONGO_URL ? process.env.MONGO_URL : "");
        console.log("connected to db..")
        let rezz = await UserNote.find({"email": req.query['email']})
        console.log(`thsse are the get user posts results: ${rezz}`)
        res.status(200).json(rezz)
      }

      
    }


    
  } catch (error: any) {
    console.log("error")
  }
  

})
