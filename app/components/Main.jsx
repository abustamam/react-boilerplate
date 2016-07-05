import React from 'react'
// import request from 'superagent'
// import _ from 'lodash'
// import Icon from './icon'

class Main extends React.Component {

  constructor (props) {
    super(props)
    this.displayName = 'Main'
    this.interval = setInterval(::this.increment, 1000)
  }

  componentWillUnmount () {
    clearInterval(this.interval)
  }

  state = {
    counter: 0
  }

  increment () {
    this.setState({ counter: this.state.counter + 1 })
  }

  render () {
    const { counter } = this.state
    return <div className="main">Counter: {counter}</div>
  }
}

export default Main
