type EapReverseGeocode = {
  geocode: Array<ReverseGeocodeAttributes>
}

type ReverseGeocodeAttributes = {
  city: string,
  country: string
}

export default EapReverseGeocode;