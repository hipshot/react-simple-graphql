# React Simple GraphQL

Simple GraphQL client for React.

```
import {Query, Mutation} from '@hipshot/react-simple-graphql';

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


## `<Query/>`

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

## `<Mutation/>`

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
      // mutation ran unsuccessfully,
      // do stuff with errors
    ) : data ? (
      // mutation ran successfully,
      // do stuff with results
    ) : (
      // `mutation` is a function that passes its
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

## `<Provider/>`

To make the `uri` prop optional on `<Query/>` and `<Mutation/>`, use  `<Provider/>`. Any `<Query/>` or `<Mutation/>` component that's a descendent of `<Provider/>` will receive the URI via context.

```
const uri = ;

<Provider uri="https//example.org/graphql">
  <div>
    <Query query={query}>
    {({data})=> (
      // do stuff with data
    )}
    </Query>
  </div>
</Provider>
```

A `uri` prop on the `<Query/>` or `<Mutation/>` always take precendence over one provided by `<Provider/>`.


## `withUri` HoC

Another way to make the `uri` prop optional on `<Query/>` and `<Mutatation/>` is with a static method provided on both components called `withUri`:

Eg:

```
import {Query} from '@hipshot/react-simple-graphql';
export default Query.withUri(uri);
```
