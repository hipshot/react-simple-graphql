import React from "react";
import { createApolloFetch } from "apollo-fetch";
import PropTypes from "prop-types";
import equals from "deep-equal";

const contextTypes = {
  uri: PropTypes.string
};

const defaultProps = {
  onData: x => null,
  onError: x => null
};

export class Query extends React.Component {
  static withUri = uri => props => <Query uri={uri} {...props} />;

  static contextTypes = contextTypes;

  static defaultProps = defaultProps;

  state = { loading: false, data: null, errors: null };

  getUri() {
    // destructing context doesn't work /shrug
    return this.props.uri || this.context.uri;
  }

  componentDidMount() {
    const uri = this.getUri();

    this.doFetch({ ...this.props, uri });
  }

  componentWillReceiveProps(nextProps) {
    const { query, variables } = this.props;
    const uri = this.getUri();
    if (nextProps.query !== query || !equals(nextProps.variables, variables)) {
      this.doFetch({ ...nextProps, uri });
    }
  }

  doFetch({ uri, query, variables }) {
    this.setState(state => ({ loading: true, data: null, errors: null }));
    const apolloFetch = createApolloFetch({ uri });

    apolloFetch({ query, variables })
      .then(({ data, errors }) => {
        this.setState(state => ({ loading: false, data, errors }));
        this.props.onData({ data, errors });
      })
      .catch(errors => {
        this.setState(state => ({
          loading: false,
          data: false,
          errors: errors
        }));
        this.props.onError({ errors });
      });
  }

  render() {
    const { children, render, renderLoading } = this.props;
    const { loading, data, errors } = this.state;
    if (loading && renderLoading) {
      return renderLoading();
    }
    if (render && (data || errors)) {
      return render({ data, errors });
    }
    if (children) {
      return children({ loading, data, errors });
    }
    return null;
  }
}
