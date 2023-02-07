import type { NextPage } from 'next'
import React, { useEffect, useRef, useState } from 'react'
import styles from '../styles/Home.module.css'
import Link from 'next/link';
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Button, Grid } from "@nextui-org/react";
import { Textarea  } from '@nextui-org/react';
import { Container, Card, Row, Text } from "@nextui-org/react";


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

    makeRequest("/api/user-posts?", "", "GET", {"email": props.name, "limited": true}).then((data) => {
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
  
  const getAllPosts = () => {
    console.log("get all posts...")
    makeRequest("/api/user-posts?", "", "GET", {"email": props.name}).then((data) => {
      console.log(`data: ~${JSON.stringify(data)}`)
      setPastPosts(data)
    })
  }

  const tagStagingOnChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("tag handler triggered.")
    tagDraft = (e.target as HTMLInputElement).value
    console.log('tagdraft: ', tagDraft)

  }


  return (
    <>
      <Container>
        <Grid.Container gap={2}>
          <main className={styles.main}>

            <Button onClick={getAllPosts} bordered color="secondary" auto>All Notes</Button>
          
            <div className={styles.grid3}>
              {
                loadingNotes 
                ? 
                  (<h1>Loading.....</h1>) 
                : 
                  (<>{
                      pastPosts.map((post) => {
                        return (
                          <Grid sm={4} xs={12} key={post._id + "Grid"}>
                            <Card key={post._id + "div"}>
                              <Card.Body>
                                <ReactMarkdown remarkPlugins={[remarkGfm]} key={post._id} >{post.note}</ReactMarkdown>
                                <span id={post._id + post.email} key={post._id + post.email}>{post.email} | {post.tags}</span>
                              </Card.Body>
                            </Card>
                          </Grid>
          
                        )
                      })
                  }</>)
                
              }
            </div>

            <div>
              <br />
              <Grid.Container gap={1}>
                <Grid sm={10} xs={8}>
                  <Textarea
                    name='message' 
                    value={postStaging}
                    id='message' 
                    placeholder="Enter your amazing ideas."
                    cols={100}
                    minRows={10}
                    maxRows={14}
                    onChange={(e) => {setPostStaging(e.target.value)}}
                  />
                </Grid>
                <Grid sm={2} xs={4}>
                  <Card>
                    <h2>Tags</h2>
                    <div className={styles.grid2}>
                      <input type='text' name="tags" placeholder='' ref={refTagInput} className={styles.entryInput} onChange={tagStagingOnChangeHandler}></input>
                      <button onClick={tagSubmitHandler}>+</button>
                      <hr />
                      <p>Recently used:</p>
                    
                    </div>
                  </Card>
                </Grid>
              </Grid.Container>

              {
                tags.map((tag) => {
                  return (
                    <button id={tag} key={tag + (Math.random() + 1).toString(36).substring(7)}>{tag}</button>
                  )
                })
              }
              <hr />
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
        </Grid.Container>
      </Container>
    </>
  )
}

export default Note
