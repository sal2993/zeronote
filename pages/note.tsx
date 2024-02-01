import type { NextPage } from 'next'
import React, { useEffect, useRef, useState } from 'react'
import styles from '../styles/Home.module.css'
import Link from 'next/link';
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import PointLocation from '../types/point_location';
import extractTags from '../utils/utils';


const Note: NextPage<any> = (props: any) => {

  let postDraft: string;

  const [pastPosts, setPastPosts] = useState([] as Array<any>)
  const [location, setLocation] = useState({} as PointLocation | undefined);
  const [postStaging, setPostStaging] = useState('');


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

    makeRequest("/api/user-post?", "", "GET", {"email": props.name, "limited": true}).then((data) => {
      console.log(`data: ~${JSON.stringify(data)}`)
      setPastPosts(data)
    })  

  }, []);

  useEffect(() => {
    if('geolocation' in navigator) {
      // Retrieve latitude & longitude coordinates from `navigator.geolocation` Web API
      navigator.geolocation.getCurrentPosition(({ coords }) => {
          const { latitude, longitude } = coords;
          console.log(`lat: ${latitude}. lng: ${longitude}`)
          setLocation({ latitude, longitude });
      }, (error) => {
        if (error.code == error.PERMISSION_DENIED) {
          console.log("user denied permissions.")
          setLocation(undefined)
        }
        else {
          console.log("some error getting location.")
          setLocation(undefined)
        }
      });
    }
    else {
      setLocation(undefined)
    }
}, []);


  const submitNoteHandler = async (e: React.ChangeEvent<HTMLButtonElement> | any) => {

    e.target.disabled = true
    console.log("submitting the post payload: ", postStaging)
    console.log(`submitting the location ${location}`)
    console.log("submitting the user: ", props.name)

    let postTags = extractTags(postStaging)
    console.log("TAG! s: ", postTags)
    if (postStaging != "") {

      const note_post = {
        note: postStaging,
        tags: postTags,
        location: location,
        email: props.name // todo: change to props.name after this mf plane
      }

      console.log("body of node: ", note_post)
      console.log("serialize body: ", JSON.stringify(note_post))


      makeRequest( "/api/user-post", "", "POST", note_post).then((data) => {
        console.log(data)
        e.target.disabled = false
        // todo: add the data to the react state.
        setPostStaging('')
        setPastPosts((prevState) => {return [...prevState, data]})
      })
    } else {
      e.target.disabled = false
    }
    
    
  }
  
  const loadAllNotesHandler = () => {
    console.log("get all posts...")
    makeRequest("/api/user-posts?", "", "GET", {"email": props.name}).then((data) => {
      console.log(`data: ~${JSON.stringify(data)}`)
      setPastPosts(data)
    })
  }

  return (
    <div className={styles.container}>
      <h4 className={styles.noteHeader}>Zero Note</h4>
      <span>{props.name}</span>


      <main className={styles.main}>
        <button onClick={loadAllNotesHandler} className={styles.b1}>Load All Notes</button>

        <div className={styles.grid3}>
          {
            pastPosts.map((post) => {
              return (
                (post) 
                ?
                  <div className={styles.card} key={post._id + "div"}>
                    <ReactMarkdown remarkPlugins={[remarkGfm]} key={post._id} >{post.note}</ReactMarkdown>
                    <span id={post._id + post.email} key={post._id + post.email}>{post.email} | {post.city_country} | {post.tags}</span>
                  </div>
                :
                  <p>No posts here... yet..</p>

              )
            })
          }
        </div>

        <div>
          <br />
          <div className={styles.grid}>
            <textarea name='message'
              value={postStaging}
              id='message'
              rows={10}
              cols={100}
              onChange={(e) => {setPostStaging(e.target.value)}}
            />
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