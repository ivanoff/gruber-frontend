import React, { Component } from 'react';
const request = require('request');
const conf = require('./config');

class App extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      from: undefined,
      to: undefined,
      prices: undefined,
    };
  }

  setValue(field, event) {
    this.setState({ [field]: event.target.value });
  }

  search(e) {
    e.preventDefault();
    const { from, to } = this.state;

    const options = {
      uri: conf.backend.url || 'http://localhost:3038',
      method: 'POST',
      Accept: 'application/json',
      'Content-Type': 'application/json',
      json: { from, to },
    };

    request(options, (error, response, body) => {
      console.log({ error, response, body });
      if (!error && response.statusCode === 200) {
        for( let data of body ) {
          data.name = conf.prefix + data.name;
          data.value += conf.additional;
          if( data.value < 0 ) data.value = 0;
        }
        this.setState({ prices: body });
      }
    });
  }

  render() {
    let resultPrices;
    if( this.state.prices ) {
      resultPrices = [ <h2>SELECT CAR</h2> ];
      resultPrices.push( this.state.prices.map( data =>
        <div className="row">
          <div className="col-md-2">
            { data.name }
          </div>
          <div className="col-md-2">
            { data.value || 'For Free!' }
          </div>
        </div>
      ) );
    }

    return (
      <div className="App">
        <h2>SEARCH CARS</h2>
        <form onSubmit={this.search.bind(this)}>
            <div className="row">
                <div className="col-md-5">
                    <input
                      name="from"
                      ref="from"
                      className="form-control input-lg"
                      size="50"
                      placeholder="From Address"
                      onChange={this.setValue.bind(this, 'from')}
                      required />
                </div>
                <div className="col-md-5">
                    <input name="to"
                      ref="to"
                      className="form-control input-lg"
                      size="50"
                      placeholder="To Address"
                      onChange={this.setValue.bind(this, 'to')}
                      required />
                </div>
                <div className="col-md-2">
                    <button
                      className="btn-primary btn-lg"
                      onClick={this.search.bind(this)}>
                        Search
                    </button>
                </div>
            </div>
        </form>
        { resultPrices }
      </div>
    );
  }

}

export default App;
