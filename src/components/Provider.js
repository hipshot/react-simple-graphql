import React from "react";
import PropTypes from "prop-types";

const contextTypes = {
  uri: PropTypes.string,
  before: PropTypes.func,
  after: PropTypes.func
};

export default class Provider extends React.Component {
  static childContextTypes = contextTypes;

  getChildContext() {
    return {
      uri: this.props.uri,
      before: this.props.before,
      after: this.props.after
    };
  }

  render() {
    return <div>{this.props.children}</div>;
  }
}
