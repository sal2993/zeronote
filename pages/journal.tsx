import type { NextPage } from 'next'
import Head from 'next/head'
import React, { KeyboardEventHandler } from 'react'
import styles from '../styles/Home.module.css'

let userPostDraft = ''

const userPostDraftHandler = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
  if (e != null) {
    console.log("result: :", (e.target as HTMLTextAreaElement).value)
    userPostDraft = (e.target as HTMLTextAreaElement).value
  }
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

const Journal: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Zero Note</title>
        <meta name="description" content="A no frills, journal app." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1>Zero Note</h1>
        <h5>A no frills notes, journal app</h5>

        

      </main>


      <footer className={styles.footer}>
        <h4>
          Zero Note
        </h4>
      </footer>
    </div>
  )
}

export default Journal
