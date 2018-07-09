const gql = require('graphql-tag');
const { ApolloClient, HttpLink, InMemoryCache } = require('apollo-boost');

const client = new ApolloClient({
  link: new HttpLink({ uri: '/graphql' }),
  cache: new InMemoryCache(),
});

const query = gql`
  query dummyData($id: ID!) {
    dummyData(id: $id) {
      id
      dataString
    }
  }
`;

client.query({ query, variables: { id: 1 }, errorPolicy: 'all' })
  .then(console.log)
  .then(() => client.query({ query, variables: { id: 2 }, errorPolicy: 'all' }))
  .then(console.log)
  .then(() => client.query({ query, variables: { id: 1 }, errorPolicy: 'all' }))
  .then(console.log)
  .then(() => client.query({ query, variables: { id: 2 }, errorPolicy: 'all' }))
  .then(console.log);
