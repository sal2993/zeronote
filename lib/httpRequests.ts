
async function makeRequest (url: string, endpoint: string, requestMethod: string, body: Record<string, string | string[]> | any)  {

  let requestConfig: RequestInit
  let reqUrl: string

  if (requestMethod != 'GET') {
    reqUrl = url + endpoint
    requestConfig = {
      method: requestMethod,
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    }
  } else {

    const searchParams = new URLSearchParams(body as Record<string, string>)
    console.log(`query params = ${searchParams}`)
    reqUrl = url + endpoint + searchParams.toString()
    requestConfig = {
      method: requestMethod,
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json'
      },
    }
  }
 
  console.log(`url: ${url} endpoint: ${endpoint} requestMethod: ${requestMethod} body: ${body}`)
  console.log(`requestConfig: ${JSON.stringify(requestConfig)} reqUrl: ${reqUrl}`)

  const res = await fetch( reqUrl, requestConfig )
  const res_data = await res.json();
  return res_data
}

export default makeRequest;