import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { AppContainer } from 'react-hot-loader'

ReactDOM.render(<AppContainer component={App} />, document.getElementById('root'))

if (module.hot) {
	module.hot.accept('./App', () => {
		ReactDOM.render(<AppContainer component={require('./App').default} />, document.getElementById('root'))
	})
}