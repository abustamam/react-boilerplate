import 'react-hot-loader/patch'
import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import App from './components/app'

// ReactDOM.render(<App />, document.getElementById('root'))
console.log('lol')

if (process.env.NODE_ENV !== 'production') {
  React.Perf = require('react.addons-perf')
}

document.body.appendChild(component())
