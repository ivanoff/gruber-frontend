import React, { Component } from 'react';
import 'font-awesome/css/font-awesome.min.css';
const request = require('request');
const conf = require('./config');

class App extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      from: undefined,
      to: undefined,
      data: undefined,
      waitSign: false
    };
  }

  setValue(field, event) {
    this.setState({ [field]: event.target.value });
  }

  search(e) {
    e.preventDefault();
    this.setState({ data: undefined, waitSign: true });
    const { from, to } = this.state;

    const options = {
      uri: conf.backend.url || 'http://localhost:3038',
      method: 'POST',
      Accept: 'application/json',
      'Content-Type': 'application/json',
      json: { from, to },
    };

    request(options, (error, response, body) => {
      this.setState({ waitSign: false });
      if (!error && response.statusCode === 200)
        this.setState({ data: body })
      else
        this.setState({ data: { error: error? error.message : body } })
    });
  }

  render() {
    let resultPrices;
    let error = this.state.data && this.state.data.error;
    if( error ) {
      resultPrices = <h4>Error: {error}</h4>;
    } else if( this.state.data ) {
      const data = this.state.data;
      resultPrices = [];
      resultPrices.push( <h2>PRICE INFORMATION</h2> );
      resultPrices.push(
        <div className="row">
          <div className="col-md-2">
            Name
          </div>
          <div className="col-md-2">
            Minimum price
          </div>
          <div className="col-md-2">
            Estimate from
          </div>
          <div className="col-md-2">
            Estimate to
          </div>
          <div className="col-md-2">
            Currency
          </div>
          <div className="col-md-2">
            Distance
          </div>
        </div>
      );
      resultPrices.push( data.prices.map( data =>
        <div className="row">
          <div className="col-md-2">
            { data.localized_display_name }
          </div>
          <div className="col-md-2">
            { data.minimum || 'For Free!' }
          </div>
          <div className="col-md-2">
            { data.low_estimate || 'For Free!' }
          </div>
          <div className="col-md-2">
            { data.high_estimate || 'For Free!' }
          </div>
          <div className="col-md-2">
            { data.currency_code }
          </div>
          <div className="col-md-2">
            { data.distance }
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
                      placeholder="Start Address"
                      onChange={this.setValue.bind(this, 'from')}
                      required />
                </div>
                <div className="col-md-5">
                    <input name="to"
                      ref="to"
                      className="form-control input-lg"
                      size="50"
                      placeholder="Destination Address"
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
            { this.state.waitSign && <div><div className="fa fa-spinner fa-spin"></div> searching...</div> }
            { resultPrices && !error && <div className="row">
                <div className="col-md-5">
                  Start Address: <b>{this.state.data.from}</b>
                </div>
                <div className="col-md-5">
                  Destination Address: <b>{this.state.data.to}</b>
                </div>
            </div> }
        </form>
        { resultPrices }
      </div>
    );
  }

}

export default App;
