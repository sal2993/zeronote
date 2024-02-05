// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Resend } from 'resend';
import { isEmail } from '../../utils/utils';

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
        console.log("this is converting to string: ", user_email.toString())
        if (isEmail(user_email.toString())) {

          console.log("about to send email..")
        
          const { data, error } = await resend.emails.send({
            from: SCAMARA_EMAIL,
            to: [SCAMARA_EMAIL],
            subject: 'Zeronote: Add User',
            text: `Add this user --> ${user_email}`
          });
        
          if (error) {
            return res.status(400).json(error);
          }
        
          res.status(200).json(data);
        }
        else {
          console.log("incorrect email format")
          res.status(400).send({})
        }
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