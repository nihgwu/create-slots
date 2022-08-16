import React from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'

import { Field } from '../components/Field'
import { StaticField } from '../components/StaticField'
import { Select } from '../components/Select'
import { Field as SimpleField } from '../components/SimpleField'
import { Select as RFCSelect } from '../components/RFCSelect'

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
            <h2>RFC</h2>
            <div>
              <RFCSelect>
                <RFCSelect.Item value="foo">
                  <RFCSelect.Item.Title>Foo</RFCSelect.Item.Title>
                </RFCSelect.Item>
                <RFCSelect.Divider />
                {count % 3 !== 2 && (
                  <>
                    <RFCSelect.Item value="bar">
                      <RFCSelect.Item.Title>Bar</RFCSelect.Item.Title>
                    </RFCSelect.Item>
                    <RFCSelect.Divider />
                  </>
                )}
                <RFCSelect.Item value="baz">
                  <RFCSelect.Item.Title>Baz</RFCSelect.Item.Title>
                  <RFCSelect.Item.Description>
                    count {count}
                  </RFCSelect.Item.Description>
                </RFCSelect.Item>
              </RFCSelect>
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
            <h2>Simple</h2>
            <div>
              <SimpleField>
                <SimpleField.Input />
                <SimpleField.Label>Label</SimpleField.Label>
                {count % 3 !== 0 && (
                  <SimpleField.Description>
                    Description {count}
                    <SimpleField>
                      <SimpleField.Input />
                      <SimpleField.Label>Label</SimpleField.Label>
                      <SimpleField.Description>
                        Nested SimpleField {count}
                      </SimpleField.Description>
                    </SimpleField>
                  </SimpleField.Description>
                )}
              </SimpleField>
            </div>
          </div>

          <div className={styles.card}>
            <h2>Dynamic</h2>
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
            <h2>Static</h2>
            <div>
              <StaticField>
                <StaticField.Input />
                <StaticField.Label>Label</StaticField.Label>
                {count % 3 !== 1 && (
                  <StaticField.Description>
                    Description {count}
                    <StaticField>
                      <StaticField.Input />
                      <StaticField.Label>Label</StaticField.Label>
                      <StaticField.Description>
                        Nested Field {count}
                      </StaticField.Description>
                    </StaticField>
                  </StaticField.Description>
                )}
              </StaticField>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Home
