import React from "react";

import { storiesOf } from "@storybook/react";
import { Query, Mutation } from "../index";

const uri = `http://localhost:8081/v1/graphql`;

const MyQuery = Query.withUri(uri);

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
    <Query query={query1} uri={uri}>
      {({ data }) => data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </Query>
  ))
  .add("query (withUri HoC)", () => (
    <MyQuery query={query1}>
      {({ data }) => data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </MyQuery>
  ))
  .add("query with variables", () => <Demo1 uri={uri} />)
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

// const query = `{
//   phaseTypes{
//     phaseType
//     sequence
//     isDrilling
//   }
// }`;

// <Query query={query}>
//   {({data}) => (
//     data && <div>{data.sequence}</div>
//   )}
// </Query>

// <Query
// query={}
// render={({ data }) => (
//   data && <span>{JSON.stringify(data, null, 2)}</span>

// )
// />

// <Query mutation={mutation}>
//   {({mutationName, results}) => (
//     <div>
//       {results && (<redirect to="/" />)}
//       <Button onClick={mutationName} value="save" />
//     </div>

//   )}
// </Query>
