

export function extractTags(body: string): Array<string> | null {

  if (body != undefined || body != '') {
    const regex = /#[a-z0-9_]+/g
    let match_results = body.match(regex)
    console.log(match_results)


    return match_results
  }
  return []
  
}

export function isEmail(email: string): boolean {
  const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g
  let match_results = email.match(regex)
  if (!match_results) {
    return false
  }
  return true
}

