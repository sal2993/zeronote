import type { NextPage } from 'next'
import Head from 'next/head'
import React, { useState } from 'react'
import styles from '../styles/Home.module.css'
import { useUser } from '@auth0/nextjs-auth0';
import Link from 'next/link';
import Note from './note'
import makeRequest from '../lib/httpRequests';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';


const Home: NextPage = () => {
  const { user, error, isLoading } = useUser();

  const [signup, setSignup] = useState(false)
  const [signupSent, setSignupSent] = useState(false)

  const [email, setEmail] = useState('')

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  const signupHandler = () => {
    setSignup(true)
  }

  const sendEmail = () => {
    console.log("sending email...")

    makeRequest("/api/send-email?", "", "GET", {"email": email}).then((data) => {
      console.log("sent.. ~" + JSON.stringify(data))
      if (data.emailSent) {
        setSignupSent(true)
        setTimeout(() => {setSignup(false)}, 4000)
      }
    })
  }

  const signupMessage = `### Want to sign up?
  Zeronote is in BETA. Here are some still missing features:
  - No encryption in database yet
  - One cannot yet view notes by tag (filter)

  If you would still like to try Zeronote in BETA, 
  send your email and I&#39;ll create you an account with instructions.`

  return (
    <div className={styles.container}>
      
      <Head>
        <title id='title'>Zero Note</title>
        <meta id="meta" name="description" content='A "no frills" notes app.' />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main} id='main'>
        
        {
          user ? (
            <> 
                <Note name={user.name}></Note>
            </>
          ) :
            (
              <>
                <h1 className={styles.spacing}>Zero Note</h1>
                <h5>A &#34;no frills&#34; notes app.</h5>
                {
                  !signup ? (
                    <></>
                  ) :
                  (
                    <div className={styles.grid3}>
                      <div className={styles.card2} style={{backgroundColor: "#56636f"}}>
                        <ReactMarkdown remarkPlugins={[remarkGfm]} key='signup' >{signupMessage}</ReactMarkdown>
                        <input type='email' value={email} onChange={(e) => setEmail(e.target.value)}/>
                        <button onClick={sendEmail} className={styles.b1}>submit</button>
                      </div>

                    </div>
                  )
                }
                {
                  !signupSent ? (
                    <></>
                  ) :
                  (
                    <h4>Signup Request Successfully Sent!! Please allow for 1-2 days for account creation.</h4>
                  )
                }
                <div className={styles.spacingTopBottom}>
                  <button className={styles.b1}>
                    <Link href="/api/auth/login">Login</Link>
                  </button>
                  <button className={styles.b1} onClick={signupHandler}>
                    Signup
                  </button>
                  
                </div>
              </>
            )
        }
      </main>
    </div>
  )
}

export default Home
