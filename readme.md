# React Simple GraphQL

Simple GraphQL, in-browser-client for React apps. Wraps apollo-fetch.

Goal is to be usable with a minimal amount of setup, but still configurable enough to handle more complex use-cases.

```
import Query from '@hipshot/react-simple-graphql/Query';

<Query query={query} variables={variables}>
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
<Query
  uri={uri}
  query={query}
  variables={variables}
  before={beforeMiddleware}
  after={afterMiddleware}
  onData={fn}
  onError={fn}
>
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
  before={beforeMiddleware}
  after={afterMiddleware}
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

<Mutation
  uri={uri}
  mutation={mutation}
  before={beforeMiddleware}
  after={afterMiddleware}
>
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

To globally change the `uri`. `before`, and `after` of all `<Query/>` and `<Mutation/>`, a `<Provider/>` component can be added at the top of your UI tree.

Any `<Query/>` or `<Mutation/>` component that's a descendent of `<Provider/>` will receive the `uri` prop, as well as any configured `before` and `after` middleware via context.

```
import Provider from '@hipshot/react-simple-graphql/Provider';

<Provider uri="https//example.org/graphql" before={beforeMiddleware} after={afterMiddleware}>
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

If `before` and `after` middleware exist in both the `<Provider />` and `<Query />` or `<Mutation />`, those middlewares are chained together with middleware added via `<Provider />` are ran first.

## Middleware

Both the request and the response can be decorated or acted upon immedately `before` or `after` making the request or receiving the response respectively. This is helpful for adjusting headers (before) or global-handling of particular responses.

### `before`

```
const appendTokenMiddleware = ({ request, options }, next) => {
  options.headers = {
    ...options.headers,
    "x-access-token": `1234`
  };

  next();
};
```

This `before` middleware can now be attached to `<Provider />`, `<Query />`, or `<Mutation />` via the `before` prop.

```
<Query before={appendTokenMiddleware} query={query} />

// or
<Mutation before={appendTokenMiddleware} query={query} />

// or
<Provider before={appendTokenMiddleware}>
  ...
</Provider>
// where all descendant `Query` or `Mutation` elements will use this middleware.
```

### `after`

```
const logStatus = ({ response }, next) => {
  action("response status")(response.status);
  next();
};
```

This `after` middleware can now be attached to `<Provider />`, `<Query />`, or `<Mutation />` via the `after` prop.

```
<Query after={logStatus} query={query} />

// or
<Mutation after={logStatus} query={query} />

// or
<Provider after={logStatus}>
  ...
</Provider>
// where all descendant `Query` or `Mutation` elements will use this middleware.
```


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
