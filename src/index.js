import React from "react";
import { createApolloFetch } from "apollo-fetch";

const withUri = (uri, Component) => props => <Component uri={uri} {...props} />;

export class Query extends React.Component {
  static withUri = uri => withUri(uri, Query);

  state = { loading: false, data: null, errors: null };

  componentDidMount() {
    this.doFetch(this.props);
  }

  componentWillReceiveProps(nextProps) {
    const { uri, query, variables } = this.props;
    if (
      nextProps.uri !== uri ||
      nextProps.query !== query ||
      JSON.stringify(nextProps.variables) !== JSON.stringify(variables)
    ) {
      this.doFetch(nextProps);
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
  static withUri = uri => withUri(uri, Mutation);

  state = { loading: false, data: null, errors: null };

  doFetch = query => variables => {
    const { uri } = this.props;
    this.setState(state => ({ loading: true, data: false, errors: false }));
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
