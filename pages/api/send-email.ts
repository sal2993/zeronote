// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Resend } from 'resend';

const RESEND_API_KEY = process.env.RESEND_API_KEY ? process.env.RESEND_API_KEY : ""
const SCAMARA_EMAIL = process.env.SCAMARA_EMAIL ? process.env.SCAMARA_EMAIL : ""
const resend = new Resend(RESEND_API_KEY);


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  try {

    if (req.method === "GET") {
      let user_email = req.query['email']

      if (req.query && user_email) {

        console.log("about to send email..")
        resend.emails.send({
          from: SCAMARA_EMAIL,
          to: user_email,
          subject: `Zeronote add User`,
          html: `<h1>ZeroNote beta: add user</h1><p> User email: <strong>${user_email}</strong>!</p>`
        }).then(() => {console.log("sent email!")}).catch((e) => {console.error(e, "failed to sennd email...")});
        
        res.status(200).json({})
      }
    }
    else {
      res.status(501)
    }
    
  } catch (error: any) {
    console.log("error: ", error)
    res.status(400).send(error)
  }
}