import React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import { Query, Mutation, Provider } from "../index";

const uri = `http://localhost:8081/v1/graphql`;

const MyQuery = Query.withUri(uri);
const MyMutation = Mutation.withUri(uri);

const query1 = `
{
  phaseTypes {
    phaseType
    sequence
    isDrilling
  }
}`;

const badQuery = `
{
  phaseTypes {
    phaseType
    sequence
    isDrillin
  }
}
`;

const mutation = `
mutation CreateWorkActivity($input:WorkActivityCreateInput) {
  createWorkActivity(input: $input) {
    workActivity {
      id
    }
  }
}`;

storiesOf("GraqhQL", module)
  .add("query", () => (
    <Query query={query1} uri={uri} onData={action("onData")}>
      {({ data }) => data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </Query>
  ))
  .add("query (with error)", () => (
    <Query query={`doh`} uri={uri} onError={action("onError")}>
      {({ data }) => data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </Query>
  ))
  .add("query (with render cb)", () => (
    <Query
      query={query1}
      uri={uri}
      onData={action("onData")}
      render={({ data }) => <pre>{JSON.stringify(data, null, 2)}</pre>}
    />
  ))
  .add("query (withUri HoC)", () => (
    <MyQuery query={query1}>
      {({ data }) => data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </MyQuery>
  ))
  .add("query (using <Provider>", () => (
    <Provider uri={uri}>
      <Query query={query1}>
        {({ data }) => data && <pre>{JSON.stringify(data, null, 2)}</pre>}
      </Query>
    </Provider>
  ))
  .add("query with variables", () => <Demo1 uri={uri} />)
  .add("query with variables and <Provider>", () => (
    <Provider uri={uri}>
      <Demo1 />
    </Provider>
  ))
  .add("query with error", () => (
    <Query query={badQuery} uri={uri}>
      {({ data, errors }) =>
        errors ? (
          <pre>{JSON.stringify(errors, null, 2)}</pre>
        ) : (
          <span>Hooooray!!! data</span>
        )}
    </Query>
  ))
  .add("mutation", () => (
    <Mutation mutation={mutation} uri={uri}>
      {({ mutation, data, errors }) =>
        errors ? (
          <pre>{JSON.stringify(errors, null, 2)}</pre>
        ) : data ? (
          <pre>{JSON.stringify(data, null, 2)}</pre>
        ) : (
          <button
            onClick={() =>
              mutation({
                input: {
                  type: "WORKORDER",
                  vpCode: "M",
                  drill: 1234,
                  timeCard: "123",
                  hours: 22
                }
              })}
          >
            click to run mutation
          </button>
        )}
    </Mutation>
  ))
  .add("mutation with <Provider/>", () => (
    <Provider uri={uri}>
      <Mutation mutation={mutation}>
        {({ mutation, data, errors }) =>
          errors ? (
            <pre>{JSON.stringify(errors, null, 2)}</pre>
          ) : data ? (
            <pre>{JSON.stringify(data, null, 2)}</pre>
          ) : (
            <button
              onClick={() =>
                mutation({
                  input: {
                    type: "WORKORDER",
                    vpCode: "M",
                    drill: 1234,
                    timeCard: "123",
                    hours: 22
                  }
                })}
            >
              click to run mutation
            </button>
          )}
      </Mutation>
    </Provider>
  ))
  .add("mutation using withUri", () => (
    <MyMutation mutation={mutation}>
      {({ mutation, data, errors }) =>
        errors ? (
          <pre>{JSON.stringify(errors, null, 2)}</pre>
        ) : data ? (
          <pre>{JSON.stringify(data, null, 2)}</pre>
        ) : (
          <button
            onClick={() =>
              mutation({
                input: {
                  type: "WORKORDER",
                  vpCode: "M",
                  drill: 1234,
                  timeCard: "123",
                  hours: 22
                }
              })}
          >
            click to run mutation
          </button>
        )}
    </MyMutation>
  ))
  .add("mutation with error", () => (
    <Mutation mutation={mutation} uri={uri}>
      {({ mutation, data, errors }) =>
        errors || data ? (
          <pre>{JSON.stringify(errors || data, null, 2)}</pre>
        ) : (
          <button onClick={() => mutation()}>click to run mutation</button>
        )}
    </Mutation>
  ));

class Demo1 extends React.Component {
  state = {
    first: 1
  };

  query = `
  query AllRigs($first:Int) {
    allRigs(first: $first) {
      edges {
        node {
          name
        }
      }
    }
  }`;

  handleToggle = () => {
    this.setState(state => ({
      first: state.first === 1 ? 2 : 1
    }));
  };

  render() {
    return (
      <div>
        <Query query={this.query} variables={this.state} uri={this.props.uri}>
          {({ data, loading, error }) => {
            if (loading) {
              return <h1>Loading...</h1>;
            }
            if (error) {
              return <span>error</span>;
            }
            if (data) {
              return <pre>{JSON.stringify(data, null, 2)}</pre>;
            }
            return null;
          }}
        </Query>
        <button onClick={this.handleToggle}>Toggle</button>
      </div>
    );
  }
}
