import React from "react";
import PropTypes from "prop-types";

const contextTypes = {
  uri: PropTypes.string
};

export class Provider extends React.Component {
  static childContextTypes = contextTypes;

  getChildContext() {
    return { uri: this.props.uri };
  }

  render() {
    return <div>{this.props.children}</div>;
  }
}
