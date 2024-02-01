

function extractTags(body: string): Array<string> | null {

  if (body != undefined || body != '') {
    const regex = /#[a-z0-9_]+/g
    let match_results = body.match(regex)
    console.log(match_results)


    return match_results
  }
  return []
  
}

export default extractTags;