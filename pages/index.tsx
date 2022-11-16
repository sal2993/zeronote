import type { NextPage } from 'next'
import Head from 'next/head'
import React, { KeyboardEventHandler, LegacyRef, useRef, useState } from 'react'
import styles from '../styles/Home.module.css'
import { useUser } from '@auth0/nextjs-auth0';
import Link from 'next/link';

let userPostDraft = ''

const zero_note_api_url = process.env.NEXT_PUBLIC_ZERO_NOTE_API_URL

console.log("zero_note_api_url: ", zero_note_api_url)


const Home: NextPage = () => {
  const { user, error, isLoading } = useUser();

  let tagDraft = ''
  let postDraft = ''

  const [tags, setTags] = useState([] as Array<string>);
  const [tagStaging, setTagStaging] = useState([]);
  const [postStaging, setPostStaging] = useState('');
  const refTagInput = useRef("n")

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  const tagSubmitHandler = () => {
    console.log("tagSubmitHandler")
    setTags(tags => [...tags, tagDraft])
    refTagInput.current.value = ""


  }

  const submitPostHandler = async () => {
    console.log("submitting the post tags: ", tags)
    console.log("submitting the post payload: ", postStaging)
    console.log("submitting the user: ", user?.name)
    const res = await fetch(zero_note_api_url + "/users")
    console.log(res)
    // , {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json"
    //   },
    //   body: JSON.stringify({
    //     message: userPostDraft,
    //     tags: "someday"
    //   })
    // })
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
        {
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
        }
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
