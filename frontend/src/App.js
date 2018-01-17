import React, { Component } from 'react';
const conf = require( './config' );

class App extends Component {

  search() {
    console.log( conf.backend.url );
    console.log( this.refs.from.value );
    console.log( this.refs.to.value );
    fetch( conf.backend? conf.backend.url : 'http://localhost:3038', {
      mode: 'no-cors',
      method: 'GET',
      headers: {
//        "Access-Control-Allow-Credentials": true,
//        "Access-Control-Allow-Origin": "*",
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstParam: 'yourValue',
        secondParam: 'yourOtherValue',
      }),
    })
    .then((response) => console.log( response ))
    .catch((error) => {
      console.error(error);
    });;
  }

  render() {
    return (
      <div className="App">
        <h2>SEARCH CARS</h2>
        <form>
            <div className="row">
                <div className="col-md-5">
                    <input name="from" ref="from" className="form-control input-lg" size="50" placeholder="From Address" required />
                </div>
                <div className="col-md-5">
                    <input name="to" ref="to" className="form-control input-lg" size="50" placeholder="To Address" required />
                </div>
                <div className="col-md-2">
                    <button className="btn-primary btn-lg" onClick={this.search.bind(this)}>Search</button>
                </div>
            </div>
        </form>
      </div>
    );
  }
}

export default App;
