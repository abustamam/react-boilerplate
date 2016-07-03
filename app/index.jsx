import 'react-hot-loader/patch'
import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import App from './components/App'

const app = <AppContainer><App /></AppContainer>

ReactDOM.render(app, document.getElementById('app'))

if (process.env.NODE_ENV !== 'production') {
  React.Perf = require('react-addons-perf')
}
