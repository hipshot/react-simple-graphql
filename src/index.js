import React from "react";
import { createApolloFetch } from "apollo-fetch";
import PropTypes from "prop-types";

const contextTypes = {
  uri: PropTypes.string
};

export class Query extends React.Component {
  static withUri = uri => props => <Query uri={uri} {...props} />;

  static contextTypes = contextTypes;

  state = { loading: false, data: null, errors: null };

  getUri() {
    // destructing context doesn't work /shug
    return this.props.uri || this.context.uri;
  }

  componentDidMount() {
    const uri = this.getUri();

    this.doFetch({ ...this.props, uri });
  }

  componentWillReceiveProps(nextProps) {
    const { query, variables } = this.props;
    const uri = this.getUri();
    if (
      nextProps.query !== query ||
      JSON.stringify(nextProps.variables) !== JSON.stringify(variables)
    ) {
      this.doFetch({ ...nextProps, uri });
    }
  }

  doFetch({ uri, query, variables }) {
    this.setState(state => ({ loading: true, data: null, errors: null }));
    const apolloFetch = createApolloFetch({ uri });

    apolloFetch({ query, variables })
      .then(({ data, errors }) => {
        this.setState(state => ({ loading: false, data, errors }));
      })
      .catch(errors => {
        this.setState(state => ({
          loading: false,
          data: false,
          errors: errors
        }));
        return Promise.reject(errors);
      });
  }

  render() {
    const { children } = this.props;
    const { loading, data, errors } = this.state;
    return children({ loading, data, errors });
  }
}

export class Mutation extends React.Component {
  static withUri = uri => props => <Mutation uri={uri} {...props} />;

  static contextTypes = contextTypes;

  state = { loading: false, data: null, errors: null };

  getUri() {
    // destructing context doesn't work /shug
    return this.props.uri || this.context.uri;
  }

  doFetch = query => variables => {
    this.setState(state => ({ loading: true, data: false, errors: false }));

    const uri = this.getUri();
    const apolloFetch = createApolloFetch({ uri });

    apolloFetch({ query, variables })
      .then(({ data, errors }) => {
        this.setState(state => ({ loading: false, data, errors }));
      })
      .catch(errors => {
        this.setState(state => ({
          loading: false,
          data: false,
          errors: errors
        }));
        return Promise.reject(errors);
      });
  };

  render() {
    const { mutation, children } = this.props;
    const { loading, data, errors } = this.state;
    return children({
      loading,
      data,
      errors,
      mutation: this.doFetch(mutation)
    });
  }
}

export class Provider extends React.Component {
  static childContextTypes = contextTypes;

  getChildContext() {
    return { uri: this.props.uri };
  }

  render() {
    return <div>{this.props.children}</div>;
  }
}
