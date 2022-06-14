import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
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
        <form action='/api/save' method='get'>

          <label className={styles.title}>Input here: </label>
          <br></br>
          <textarea name='message' id='textArea' rows={10} cols={100}></textarea>

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

          <button>Submit</button>
        </form>
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
