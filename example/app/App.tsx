import { useState } from 'react'
import './App.css'
import { Field } from './Field'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>Hello Vite + React!</p>
        <Field>
          <Field.Input />
          <Field.Label>Field Label</Field.Label>
          <Field.Description>Field Description</Field.Description>
        </Field>
        <p>
          Edit <code>App.tsx</code> and save to test HMR updates.
        </p>
        <p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          {' | '}
          <a
            className="App-link"
            href="https://vitejs.dev/guide/features.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            Vite Docs
          </a>
        </p>
      </header>
    </div>
  )
}

export default App
