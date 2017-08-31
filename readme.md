# React Simple GraphQL

Intentionally simple GraphQL client for React

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
        <button onClick={() => mutation()}>click to run mutation</button>
      )}
</Mutation>
```

