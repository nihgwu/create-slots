import React from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'

import { Field } from '../components/Field'
import { StaticField } from '../components/StaticField'
import { Select } from '../components/Select'

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

        <div className={styles.description}>
          <button onClick={() => setCount(count + 1)}>Count {count}</button>
        </div>

        <div className={styles.grid}>
          <div className={styles.card}>
            <h2>Dynamic</h2>
            <div>
              <Field>
                <Field.Input />
                <Field.Label>Label</Field.Label>
                <Field.Description>
                  Description
                  <Field>
                    <Field.Input />
                    <Field.Label>Label</Field.Label>
                    <Field.Description>Nested Field</Field.Description>
                  </Field>
                </Field.Description>
              </Field>
            </div>
          </div>

          <div className={styles.card}>
            <h2>Static</h2>
            <div>
              <StaticField>
                <StaticField.Input />
                <StaticField.Label>Label</StaticField.Label>
                <StaticField.Description>
                  Description
                  <StaticField>
                    <StaticField.Input />
                    <StaticField.Label>Label</StaticField.Label>
                    <StaticField.Description>
                      Nested Field
                    </StaticField.Description>
                  </StaticField>
                </StaticField.Description>
              </StaticField>
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
                {count % 3 === 2 && (
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
        </div>
      </main>
    </div>
  )
}

export default Home
