import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>create-slots</title>
        <meta name="description" content="create-slots" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          <a href="https://github.com/nihgwu/create-slots">create-slots</a>
        </h1>
        <p className={`${styles.title} ${styles.description}`}>
          Fully implemented the{' '}
          <a href="https://github.com/reactjs/rfcs/pull/223">React Slots RFC</a>
          , with utils
        </p>
      </main>
    </div>
  )
}

export default Home
