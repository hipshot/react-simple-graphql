# React Simple GraphQL

Simple GraphQL client for React.

```
import {Query, Mutate} from '@hipshot/react-simple-graphql';

<Query query={query} uri={uri}>
  {({ data }) => data && <pre>{JSON.stringify(data, null, 2)}</pre>}
</Query>

<Mutation mutation={mutation} uri={uri}>
  {({ mutation, data, errors }) =>
    errors || data
      ? (
        <pre>{JSON.stringify(errors || data, null, 2)}</pre>
      ) : (
        <button onClick={(e) => mutation()}>click to run mutation</button>
      )}
</Mutation>
```


## `Query` Component

```
const uri = "https//example.org/graphql";

const query = `
  {
    dog {
      name
    }
  }
`;

<Query query={query} uri={uri}>
  {({ loading, data, errors }) => {
    //
  }}
</Query>
```

## `Mutate` Component

Example:

```
const uri = "https//example.org/graphql";
const mutation = `
mutation CreateReviewForEpisode($ep: Episode!, $review: ReviewInput!) {
  createReview(episode: $ep, review: $review) {
    stars
    commentary
  }
}`;

<Mutation mutation={mutation} uri={uri}>
  {({ mutation, data, errors }) =>
    errors ? (
      // do stuff with errors
    ) : data ? (
      // mutation already ran, do stuff with results
    ) : (
      // `mutation` is a function that will pass any
      // args as variables to the mutation, eg:
      <button
        onClick={() =>
          mutation({
            "ep": "JEDI",
            "review": {
              "stars": 5,
              "commentary": "This is a great movie!"
            }
          })}
        >
        add review
      </button>
    )}
</Mutation>
```


## `withUri` HoC

Both `Query` and `Mutatation` provide a static method that allows you
to bind a `uri`.

Eg:

```
import {Query} from '@hipshot/react-simple-graphql';

const uri = process.env.GRAPHQL_ENDPOINT;

const MyQuery = Query.withUri(uri);

<MyQuery query={`{
  hero {
    name
  }
}
`}>
  {({data}) => {
    // do stuff with data...
  }}
</MyQuery>
```
