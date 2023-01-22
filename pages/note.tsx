import type { NextPage } from 'next'
import React, { useEffect, useRef, useState } from 'react'
import styles from '../styles/Home.module.css'
import Link from 'next/link';
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'


const Note: NextPage<any> = (props: any) => {

  let tagDraft: string;
  let postDraft: string;

  const [pastPosts, setPastPosts] = useState([] as Array<any>)
  const [tags, setTags] = useState([] as Array<string>)
  const [freezeSubmit, setFreezeSubmit] = useState(false)
  const [loadingNotes, setLoadingNotes]= useState(false)
  const [tagStaging, setTagStaging] = useState([])
  const [postStaging, setPostStaging] = useState('')
  const refTagInput = useRef<any>("n")


  let makeRequest = async (url: string, endpoint: string, requestMethod: string, body: Record<string, string | string[]> | any) => {

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

  useEffect(() => {

    makeRequest("/api/user-posts?", "", "GET", {"email": props.name}).then((data) => {
      console.log(`data: ~${JSON.stringify(data)}`)
      setPastPosts(data)
      scrollToBottom()
    })


  }, [])


  const scrollToBottom = () => {
    refTagInput.current?.scrollIntoView({behavior: "smooth"})
  }

  const tagSubmitHandler = () => {
    
    console.log("tagSubmitHandler")
    setTags(tags => [...tags, tagDraft])
    refTagInput.current.value = ""
  }

  const submitNoteHandler = async () => {

    const note_post = {
      note: postStaging,
      tags: tags,
      email: props.name // todo: change to props.name after this mf plane
    }

    // lock screen
    setFreezeSubmit(true)

    makeRequest( "/api/user-posts", "", "POST", note_post).then((data) => {

      // todo: error handling...

      console.log(data)
      // todo: add the data to the react state.
      setPostStaging('')
      setTagStaging([])
      setTags([])
      setFreezeSubmit(false)
      setPastPosts((prevState) => {return [...prevState, data]})
      refTagInput.current.value = ""

    })

  }
  

  const tagStagingOnChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("tag handler triggered.")
    tagDraft = (e.target as HTMLInputElement).value
    console.log('tagdraft: ', tagDraft)

  }


  return (
    <div className={styles.container}>

      <main className={styles.main}>

        <div className={styles.grid3}>
          {
            loadingNotes 
            ? 
              (<h1>Loading.....</h1>) 
            : 
              (<>{
                  pastPosts.map((post) => {
                    return (
      
                      <div className={styles.card} key={post._id + "div"}>
                        <ReactMarkdown remarkPlugins={[remarkGfm]} key={post._id} >{post.note}</ReactMarkdown>
                        <span id={post._id + post.email} key={post._id + post.email}>{post.email} | {post.tags}</span>
                      </div>
      
                    )
                  })
              }</>)
            
          }
        </div>

        <div>
          <br />
          <div className={styles.grid}>
            <textarea name='message' value={postStaging} id='message' rows={10} cols={100} onChange={(e) => {setPostStaging(e.target.value)}}></textarea>
          </div>
          {
            tags.map((tag) => {
              return (
                <button id={tag} key={tag + (Math.random() + 1).toString(36).substring(7)}>{tag}</button>
              )
            })
          }
          <hr />
          <div className={styles.grid3}>
            <div className={styles.card}>
              <h2>Tags</h2>
              <div className={styles.grid2}>
                <input type='text' name="tags" placeholder='' ref={refTagInput} className={styles.entryInput} onChange={tagStagingOnChangeHandler}></input>
                <button onClick={tagSubmitHandler}>+</button>
                <hr />
                <p>Recently used:</p>
              
              </div>
            </div>
            <button onClick={submitNoteHandler} disabled={freezeSubmit}>Submit Post</button>
          </div>
        </div>

        <div className={styles.profile_options}>
          <div className={styles.paddingAbove}>  
          <p>
            {props.name}
          </p>
            <Link href="/api/auth/logout">Logout</Link>
          </div>
        </div>


      </main>
    </div>
  )
}

export default Note
