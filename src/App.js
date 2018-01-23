import React, { Component } from 'react';
import { PowerSelect } from 'react-power-select';
import 'font-awesome/css/font-awesome.min.css';
import 'react-power-select/dist/react-power-select.css';
const request = require('request');
const conf = require('./config');

class App extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      from: undefined,
      to: undefined,
      data: undefined,
      waitSign: false,
      searchAdress: [],
    };
  }

  handleChange = (...s) => {
    this.setState({
      [ s[0] ]: s[1].option
    })
  }

  handleSearchAddress = (...opt) => {
    const text = opt[ 1 ].select.searchTerm;
    // if( !text || text.length % 3 !== 0 ) return;
    const options = {
      uri: ( conf.backend.url || 'http://localhost:3038' ) + '/search',
      method: 'POST',
      Accept: 'application/json',
      'Content-Type': 'application/json',
      json: { text },
    };
    request(options, (error, response, body) => {
      if( !error && body && Array.isArray( body ) )
      this.setState({ searchAdress: body });
    });
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
        this.setState({ data: body });
      else
        this.setState({ data: { error: error ? error.message : body } });
    });
  }

  render() {
    let resultPrices;
    let error = this.state.data && this.state.data.error;
    if (error) {
      resultPrices = <h4>Error: {error}</h4>;
    } else if (this.state.data) {
      const data = this.state.data;
      resultPrices = [];
      resultPrices.push(<h2>PRICE INFORMATION</h2>);
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
      resultPrices.push(data.prices.map(data =>
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
      ));
    }

    return (
      <div className="App">
        <h2>SEARCH CARS</h2>
        <form onSubmit={this.search.bind(this)}>
            <div className="row">
                <div className="col-md-5">
                  <PowerSelect
                    ref="from"
                    name="from"
                    options={this.state.searchAdress}
                    selected={this.state.from}
                    onChange={this.handleChange.bind(this, "from")}
                    onKeyDown={this.handleSearchAddress}
                    className="input-lg"
                    placeholder="Start Address"
                  />
                </div>
                <div className="col-md-5">
                  <PowerSelect
                    ref="to"
                    name="to"
                    options={this.state.searchAdress}
                    selected={this.state.to}
                    onChange={this.handleChange.bind(this, "to")}
                    onKeyDown={this.handleSearchAddress}
                    className="input-lg"
                    placeholder="Destination Address"
                  />
                </div>
                <div className="col-md-2">
                    <button
                      className="btn-primary btn-lg"
                      onClick={this.search.bind(this)}>
                        Search
                    </button>
                </div>
            </div>
            { this.state.waitSign && <div>
                <div className="fa fa-spinner fa-spin"></div>
                searching...</div> }
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
