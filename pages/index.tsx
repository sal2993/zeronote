import type { NextPage } from 'next'
import Head from 'next/head'
import React, { KeyboardEventHandler } from 'react'
import styles from '../styles/Home.module.css'
import { useUser } from '@auth0/nextjs-auth0';
import Link from 'next/link';

let userPostDraft = ''

const userPostDraftHandler = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
  if (e != null) {
    console.log("result: :", (e.target as HTMLTextAreaElement).value)
    userPostDraft = (e.target as HTMLTextAreaElement).value
  }
}

let testLocked = () => {
  console.log("testing locked & unlocked")

  fetch('/api/hello', {
      method: "GET"
    }).then((response) => {console.log(response.json())})


  fetch('/api/hello-locked', {
    method: "GET"
  }).then((response) => {console.log(response.json())})
}

const submitPostHandler = async () => {
  console.log("submitting the post: ", userPostDraft)
  const res = await fetch('api/save', {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      message: userPostDraft,
      tags: "someday"
    })
  })
}

const JournalEntry = () => {
  return (
    <div>
      <br />
      <textarea name='message' id='textArea' rows={10} cols={100} onKeyUp={userPostDraftHandler}></textarea>

      <div className={styles.grid3}>
        <h3>Tags:</h3>
        <input type='text' name="tags" placeholder='note-to-self;journal (delimeter is ";")' className={styles.entryInput}></input>
        <div className={styles.card}>
          <h2>Tags for this post</h2>

        </div>

        <div className={styles.card}>
          <h2>Recent Tags</h2>  
          <p>#Wonder; #HighestInTheRoom; #Chat</p>
        </div>

      </div>

      <button onClick={submitPostHandler}>Submit</button>
      <button onClick={testLocked}>test locked endpoint</button>
    </div>
    
  )
}

const Home: NextPage = () => {
  const { user, error, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;


  return (
    <div className={styles.container}>
      <Head>
        <title>Zero Note</title>
        <meta name="description" content="A no frills, journal app." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1>Zero Note</h1>
        {
          user ? (
          <> 
            <JournalEntry />
            <div className={styles.profile_options}>
              <h2>{user.name}</h2>
              <p>{user.email}</p>
              <Link href="/api/auth/logout">Logout</Link>
            </div>
          </>
          ) 
            : (
            <>
              <h5>A no frills notes, journal app</h5>
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
