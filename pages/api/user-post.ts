// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { UserNote, UserNoteType } from '../../model/user-note.model'
import { Types } from 'mongoose';
import connectDb from '../../lib/connectDb'
import { withApiAuthRequired } from '@auth0/nextjs-auth0';
import PointLocation from '../../types/point_location';
import axios from 'axios';
import EapReverseGeocode from '../../types/eap_reverse_geocode';


export default withApiAuthRequired( async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Array<UserNoteType> | UserNoteType>
) {
  try {

    if (req.method == "POST") {

      console.log("req: ", req.body)

      let cityCountry: any // Not super clear why I can't add string value here
      let location: PointLocation = req.body['location']
      // todo: validate data comming in
      if (location) {
        
        cityCountry = await getCityCountry(location, "")
      }
      if (req.body && req.body['email'] && req.body['note'] && req.body['tags']) {
        await connectDb()
        var userNote = new UserNote({
          user_uuid: new Types.ObjectId(),
          email: req.body['email'],
          note: req.body['note'],
          date: Date.now(),
          post_id: new Types.ObjectId(),
          location: convertToGeoJson(location),
          city_country: cityCountry,
          tags: req.body['tags'],
        })
        await userNote.save();
        res.status(200).json(userNote)
        
      }
      else {
        res.status(400)
      }
    }
    // Returns 2 latest posts (not 1)
    else if (req.method === "GET") {
      console.log("Getting into the GET..")

      if (req.query && req.query['email']) {
        console.log("  passed validation...") // leaving these in bc want to migrate to proper logger.
        await connectDb()
        console.log('  connected to db')
        // let latestUserNote = await UserNote.findOne({"email": req.query['email']},{ sort: { 'created_at' : -1 } })
        let latestUserNote = await UserNote.find({"email": req.query['email']}).sort({_id: -1}).limit(2);

        // Because the find sorts by latest and limits 2, these two are 
        // actually in the wrong order when send to the front end, I re-order manually
        let tempNoteSpace = latestUserNote.shift()
        latestUserNote.push(tempNoteSpace)

        res.status(200).json(latestUserNote)

      }
    }
    
  } catch (error: any) {
    console.log("error: ", error)
    res.status(400).send(error)
  }

})

function convertToGeoJson(location: PointLocation) {
  return {
    "type": "Point",
    "coordinates": [location.longitude, location.latitude]
  }
}

async function getCityCountry(location: PointLocation, region: string) {
  let cityCountry: string
  try {
    const response = await axios.get('https://eap.corelogic.com/reverse-geocode', {
      params: {
        latitude: location.latitude,
        longitude: location.longitude
      }
    })
    let geocodeResponse: EapReverseGeocode = response.data;
    cityCountry = `${geocodeResponse.geocode[0].city}, ${geocodeResponse.geocode[0].country}`;
    console.log("city country resp: ", cityCountry);
  }
  catch (error) {
    cityCountry = "";
    console.log("something with geocoding didn't work..", error);
  }
  return cityCountry
}
