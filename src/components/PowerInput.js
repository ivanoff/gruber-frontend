import React, { Component } from 'react';
import { PowerSelect } from 'react-power-select';
const sender = require('../lib/sender');

/**
 * PowerSelect object with address search possibility
 * @param {} ref - name of PowerSelect
 * @param {} placeholder - default text
 * @example: <PowerInput ref="from" placeholder="Start Address" />
 **/
class PowerInput extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = Object.assign({}, props, { searchAdress: [], value: '' });
  }

  handleChange = (state) => {
    this.setState({ value: state.option });
  };

  handleSearchAddress = (...opt) => {
    const json = { text: opt[1].select.searchTerm };
    sender({ link: 'search', json },
      (error, response, body) => {
        if (!error && body && Array.isArray(body))
        this.setState({ searchAdress: body });
      }
    );
  };

  render() {
    return <PowerSelect
        name={this.state.ref}
        options={this.state.searchAdress}
        selected={this.state.value}
        onChange={this.handleChange}
        onKeyDown={this.handleSearchAddress}
        className="input-lg"
        placeholder={this.state.placeholder}
      />;
  }

}

export default PowerInput;
