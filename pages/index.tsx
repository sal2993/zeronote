import type { NextPage } from 'next'
import Head from 'next/head'
import React from 'react'
import styles from '../styles/Home.module.css'
import { useUser } from '@auth0/nextjs-auth0';
import Link from 'next/link';
import Note from './note'


const Home: NextPage = () => {
  const { user, error, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

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
                <h5>A "no frills" notes app.</h5>
                <div className={styles.spacingTopBottom}>
                  <button className={styles.b1}>
                    <Link href="/api/auth/login">Login</Link>
                  </button>
                  <button className={styles.b1} onClick={() => {console.log("Will show you my email alt email")}}>
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
