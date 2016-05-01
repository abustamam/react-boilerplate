import React from 'react'
import request from 'superagent'

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.displayName = 'Main';
    }
    render() {
        return <div className="main">
        	Main
        </div>;
    }
}

export default Main