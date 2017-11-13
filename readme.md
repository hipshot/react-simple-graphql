# React Simple GraphQL

Simple GraphQL client for React.

```
import Query from '@hipshot/react-simple-graphql/Query';

<Query uri={uri} query={query} variables={variables}>
  {({ data }) => data && <pre>{JSON.stringify(data, null, 2)}</pre>}
</Query>
```

## Install

```
npm i @hipshot/react-simple-graphql
```

## Components


### `Query` Component


```
import Query from '@hipshot/react-simple-graphql/Query';
const uri = "https//example.org/graphql";

const query = `
  {
    dog {
      name
    }
  }
`;
```

Calling with the function-as-child pattern:

```
<Query uri={uri} query={query} variables={variables} onData={fn} onError={fn}>
  {({ loading, data, errors }) => {
    //
  }}
</Query>
```

Calling with render callbacks `render` and `renderLoading`.

```
<Query
  uri={uri}
  query={query}
  variables={variables}
  onData={fn}
  onError={fn}
  renderLoading={ () => <Loading />}
  render={ ({data, errors}) => <SomethingOnceQueryCompletes /> }
/>
```

---

### `Mutation` Component

Example:

```
import Mutation from '@hipshot/react-simple-graphql/Mutation';

const uri = "https//example.org/graphql";
const mutation = `
mutation CreateReviewForEpisode($ep: Episode!, $review: ReviewInput!) {
  createReview(episode: $ep, review: $review) {
    stars
    commentary
  }
}`;

<Mutation uri={uri} mutation={mutation} >
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

---

### `Provider` Component

To make the `uri` prop optional on `<Query/>` and `<Mutation/>`, use  `<Provider/>`. Any `<Query/>` or `<Mutation/>` component that's a descendent of `<Provider/>` will receive the URI via context.

```
import Provider from '@hipshot/react-simple-graphql/Provider';

<Provider uri="https//example.org/graphql">
  <div>
    <Query query={query} variables={variables}>
    {({data})=> (
      // do stuff with data
    )}
    </Query>
  </div>
</Provider>
```

A `uri` prop on the `<Query/>` or `<Mutation/>` will always take precendence over the `uri` provided by `<Provider/>`.



## `withUri` HoC

Another way to make the `uri` prop optional on `<Query/>` and `<Mutatation/>` is with a static method provided on both Query and Mutation called `withUri`:

Eg:

```
// my-gql-client.js
import {Query as Q, Mutation as M} from '@hipshot/react-simple-graphql';

const uri = "https//example.org/graphql";

export const Query = Q.withUri(uri);
export const Mutation = M.withMutation(uri);
```
