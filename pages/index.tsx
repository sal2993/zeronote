import type { NextPage } from 'next'
import Head from 'next/head'
import React, { KeyboardEventHandler, LegacyRef, useEffect, useRef, useState } from 'react'
import styles from '../styles/Home.module.css'
import { useUser } from '@auth0/nextjs-auth0';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

let userPostDraft = ''

// todo: change back to: process.env.NEXT_PUBLIC_ZERO_NOTE_API_URL
const zero_note_api_url = 'http://localhost:3001'




const Home: NextPage = () => {
  const { user, error, isLoading } = useUser();

  let tagDraft: string;
  let postDraft: string;

  const [pastPosts, setPastPosts] = useState([] as Array<any>)
  const [tags, setTags] = useState([] as Array<string>);
  const [tagStaging, setTagStaging] = useState([]);
  const [postStaging, setPostStaging] = useState('');
  const refTagInput = useRef<any>("n")


  // todo: create a parameter "responseType", that sets the response type that is expected. This way we can map [Object object] to an actual type.
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
   


    const res = await fetch( reqUrl, requestConfig )
    const res_data = await res.json();
    return res_data
  }

  useEffect(() => {
    makeRequest( zero_note_api_url, '/user-posts?', 'GET', {email: 'calvin@unix.xyz'}).then((data) => {
      setPastPosts(data)
    });
  }, [])

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  const tagSubmitHandler = () => {
    console.log("tagSubmitHandler")
    setTags(tags => [...tags, tagDraft])
    refTagInput.current.value = "" // fixed..

  }




  const submitNoteHandler = async () => {

    console.log("submitting the post tags: ", tags)
    console.log("submitting the post payload: ", postStaging)
    console.log("submitting the user: ", 'calvin@unix.xyz')

    const note_post = {
      post_entry: postStaging,
      post_tags: tags,
      email: 'calvin@unix.xyz' // todo: change to user?.name after this mf plane
    }

    console.log("body of node: ", note_post)
    console.log("serialize body: ", JSON.stringify(note_post))

    makeRequest( zero_note_api_url, "/user-posts", "POST", note_post).then((data) => {
      console.log(data)
      // todo: add the data to the react state.
      setPostStaging('')
      setTagStaging([])
      setTags([])
      setPastPosts((prevState) => {return [...prevState, data]})
      refTagInput.current.value = ""

    })

  }
  

  const noteOnChangeDraftHandler = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e != null) {
      console.log("result: :", (e.target as HTMLTextAreaElement).value)
      postDraft = (e.target as HTMLTextAreaElement).value
      setPostStaging((e.target as HTMLTextAreaElement).value)
      // userPostDraft = (e.target as HTMLTextAreaElement).value
    }
  }

  const tagStagingOnChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("tag handler triggered.")
    tagDraft = (e.target as HTMLInputElement).value
    console.log('tagdraft: ', tagDraft)

  }


  return (
    <div className={styles.container}>
      <Head>
        <title id='title'>Zero Note</title>
        <meta id="meta" name="description" content="A no frills, journal app." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main} id='main'>
        <h1>Zero Note</h1>

        <div className={styles.grid3}>
          {
            pastPosts.map((post) => {
              return (
               

                <div className={styles.card}>
                  
                  <ReactMarkdown children={post.post_entry} remarkPlugins={[remarkGfm]} />
                  <span>{post.email} | {post.post_tags}</span>
                </div>

              )
            })
          }
        </div>

        <> 
            <div>
              <br />
              <div className={styles.grid}>
                <textarea name='message' value={postStaging} id='message' rows={10} cols={100} onChange={(e) => {setPostStaging(e.target.value)}}></textarea>

              </div>
              {
                tags.map((tag) => {
                  return (
                    <button id={tag} key={tag}>{tag}</button>
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
                <button onClick={submitNoteHandler}>Submit Post</button>
              </div>
            </div>


            <div className={styles.profile_options}>
              <div className={styles.paddingAbove}>  
                <Link href="/api/auth/logout">Logout</Link>
              </div>
            </div>
          </>
        
        {/* {
          user ? (
          <> 
            <div>
              <br />
              <div className={styles.grid}>
                <textarea name='message' value={postStaging} id='message' rows={10} cols={100} onChange={(e) => {setPostStaging(e.target.value)}}></textarea>

              </div>
              {
                tags.map((tag) => {
                  return (
                    <button id={tag} key={tag}>{tag}</button>
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
                <button onClick={submitPostHandler}>Submit Post</button>
              </div>
            </div>


            <div className={styles.profile_options}>
              <div className={styles.paddingAbove}>  
                <h2 >{user.name}</h2>
                <Link href="/api/auth/logout">Logout</Link>
              </div>
            </div>
          </>
          ) 
            : (
            <>
              <h5>A no frills notes, journal app.</h5>
              <Link href="/api/auth/login">Login</Link>
            </>
          )
        } */}
      </main>
      <footer className={styles.footer}>
        <h4>
          Zero Note
        </h4>
      </footer>
    </div>
  )
}

export default Home
