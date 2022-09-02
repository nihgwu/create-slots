import React from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'

import { Field } from '../components/Field'
import { Select } from '../components/Select'
import { Tree } from '../components/Tree'

const Home: NextPage = () => {
  const [count, setCount] = React.useState(0)
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
        {process.env.NODE_ENV === 'development' ? (
          <>
            <div className={styles.description}>
              <button onClick={() => setCount(count + 1)}>Count {count}</button>
            </div>

            <div className={styles.grid}>
              <div className={styles.card}>
                <h2>Simple</h2>
                <div>
                  <Field>
                    <div />
                    <Field.Input />
                    <Field.Label>Label</Field.Label>
                    {count % 3 !== 0 && (
                      <Field.Description>
                        Description {count}
                        <Field>
                          <Field.Input />
                          <Field.Label>Label</Field.Label>
                          <Field.Description>
                            Nested Field {count}
                          </Field.Description>
                        </Field>
                      </Field.Description>
                    )}
                  </Field>
                </div>
              </div>

              <div className={styles.card}>
                <h2>List</h2>
                <div>
                  <Select>
                    <Select.Item value="foo">
                      <Select.Item.Title>Foo</Select.Item.Title>
                    </Select.Item>
                    <Select.Divider />
                    {count % 3 !== 2 && (
                      <>
                        <Select.Item value="bar">
                          <Select.Item.Title>Bar</Select.Item.Title>
                        </Select.Item>
                        <Select.Divider />
                      </>
                    )}
                    <Select.Item value="baz">
                      <Select.Item.Title>Baz</Select.Item.Title>
                      <Select.Item.Description>
                        count {count}
                      </Select.Item.Description>
                    </Select.Item>
                  </Select>
                </div>
              </div>

              <div className={styles.card}>
                <h2>Tree</h2>
                <div>
                  <Tree>
                    <Tree.Item value="0" />
                    <Tree.Menu>
                      {count % 3 !== 1 && <Tree.Item value="1-0" />}
                      <Tree.Item value="1-1" />
                      <Tree.Menu>
                        <Tree.Item value="1-2-0" />
                        <Tree.Item value="1-2-1" />
                      </Tree.Menu>
                    </Tree.Menu>
                    {count % 3 !== 2 && (
                      <Tree.Menu>
                        <Tree.Item value="2-0" />
                        <Tree.Item value="2-1" />
                      </Tree.Menu>
                    )}
                  </Tree>
                </div>
              </div>
            </div>
          </>
        ) : (
          <p className={`${styles.title} ${styles.description}`}>
            Fully implemented the{' '}
            <a href="https://github.com/reactjs/rfcs/pull/223">
              React Slots RFC
            </a>
            , with utils
          </p>
        )}
      </main>
    </div>
  )
}

export default Home
