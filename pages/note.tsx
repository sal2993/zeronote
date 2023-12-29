import type { NextPage } from 'next'
import React, { useEffect, useRef, useState } from 'react'
import styles from '../styles/Home.module.css'
import Link from 'next/link';
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import PointLocation from '../types/point_location';
import EapReverseGeocode from '../types/eap_reverse_geocode';


const Note: NextPage<any> = (props: any) => {

  let tagDraft: string;
  let postDraft: string;

  const [pastPosts, setPastPosts] = useState([] as Array<any>)
  const [tags, setTags] = useState([] as Array<string>);
  const [location, setLocation] = useState({} as PointLocation | undefined);
  const [tagStaging, setTagStaging] = useState([]);
  const [postStaging, setPostStaging] = useState('');
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

    makeRequest("/api/user-post?", "", "GET", {"email": props.name, "limited": true}).then((data) => {
      console.log(`data: ~${JSON.stringify(data)}`)
      setPastPosts(data)
    })  

  }, [])

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

  const tagSubmitHandler = () => {
    
    console.log("tagSubmitHandler")
    setTags(tags => [...tags, tagDraft])
    refTagInput.current.value = ""
  }

  const submitNoteHandler = async () => {

    console.log("submitting the post tags: ", tags)
    console.log("submitting the post payload: ", postStaging)
    console.log(`submitting the location ${location}`)
    console.log("submitting the user: ", props.name)

    // makeRequest("/api/user-posts", "/hello-locked", "GET", "").then ((data) => {console.log("resultzzzzz ~ ", data)})

    const note_post = {
      note: postStaging,
      tags: tags,
      location: location,
      email: props.name // todo: change to props.name after this mf plane
    }

    console.log("body of node: ", note_post)
    console.log("serialize body: ", JSON.stringify(note_post))


    makeRequest( "/api/user-post", "", "POST", note_post).then((data) => {
      console.log(data)
      // todo: add the data to the react state.
      setPostStaging('')
      setTagStaging([])
      setTags([])
      setPastPosts((prevState) => {return [...prevState, data]})
      refTagInput.current.value = ""
    })
  }
  
  const loadAllNotesHandler = () => {
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
    <div className={styles.container}>


      <main className={styles.main}>
        <button onClick={loadAllNotesHandler}>Load All Notes</button>

        <div className={styles.grid3}>
          {
            pastPosts.map((post) => {
              return (

                <div className={styles.card} key={post._id + "div"}>
                  <ReactMarkdown remarkPlugins={[remarkGfm]} key={post._id} >{post.note}</ReactMarkdown>
                  <span id={post._id + post.email} key={post._id + post.email}>{post.email} | {post.city_country} | {post.tags}</span>
                </div>

              )
            })
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
            <button onClick={submitNoteHandler}>Submit Post</button>
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