// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  name: string
}
type EntryInput = {
  message: string | Array<string>,
  tags: Array<string>
}
let entryList = new Array<EntryInput>()


export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Array<EntryInput>>
) {

  let payload: EntryInput = req.body
  let tags_payload: EntryInput = req.body.tags


  entryList.push(payload)
  console.log(`entryList: ${payload}`)

  res.status(200).json(entryList)
}
