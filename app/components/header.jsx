import React from 'react'

class Header extends React.Component {
  constructor (props) {
    super(props)
    this.displayName = 'Header'
  }
  render () {
    return (<header className="header">
      <div className="logo">
        <a href="https://www.freecodecamp.com">
          <img src="https://s3.amazonaws.com/freecodecamp/freecodecamp_logo.svg"/>
        </a>
      </div>
      <div className="title">
        Happy Campers
      </div>
      <div style={{ width: 280 }}></div>
    </header>)
  }
}

export default Header
