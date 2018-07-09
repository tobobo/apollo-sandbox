const React = require('react');
const ReactDOM = require('react-dom');
const gql = require('graphql-tag');
const { ApolloClient, HttpLink, InMemoryCache } = require('apollo-boost');
const { ApolloProvider, Query } = require('react-apollo');

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

class Main extends React.Component {
  constructor() {
    super();
    this.state = { displayedId: window.location.hash.split('#')[1] || 1 };
  }

  render() {
    const { props: { client }, state: { displayedId } } = this;
    return (
      <ApolloProvider client={client}>
        <Query query={query} variables={{ id: displayedId }}>
          {({ loading, error, data }) => {
            if (loading) return <div>loading...</div>;
            if (error) return <div>error: {JSON.stringify(error)}</div>;
            return <div>{data.dummyData.dataString}</div>;
          }}
        </Query>
        <button onClick={() => this.setState({ displayedId: 1 })}>show data 1</button>
        <button onClick={() => this.setState({ displayedId: 2 })}>show data 2</button>
      </ApolloProvider>
    );
  }
}

ReactDOM.render(React.createElement(Main, { client }), document.getElementById('main'));
