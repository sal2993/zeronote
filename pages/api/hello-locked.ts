// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

import { getAccessToken, withApiAuthRequired } from '@auth0/nextjs-auth0';

type Data = {
  name: string
}


export default withApiAuthRequired(async function shows(req, res) {
  try {

    const { accessToken } = await getAccessToken(req, res, {
      scopes: ['read:shows']
    });

    const response = await fetch(`http://localhost:3000/api/shows`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    const shows = await response.json();
   
    res.status(200).json({ name: 'John Doe' });
  } catch (error: any) {
    res.status(error.status || 500).json({ error: error.message });
  }
});
