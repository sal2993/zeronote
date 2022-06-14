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


  entryList.push({
    message: req.query['message'],
    tags: req.query['tags'].toString().split(';')
  })

  res.status(200).json(entryList)
}
