const express = require('express');
const bodyParser = require('body-parser');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
const { makeExecutableSchema } = require('graphql-tools');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');

const typeDefs = `
  type Query { dummyData(id: ID!): DummyData }
  type DummyData {
    id: ID!
    dataString: String
  }
`;

const resolvers = {
  Query: {
    dummyData: (root, args) =>
      new Promise((resolve, reject) =>
        setTimeout(() => {
          if (args.id === '2') reject(new Error('can\'t do that'));
          resolve({ id: args.id, dataString: `this is data ${args.id}` });
        }, 1000)
      ),
  },
};

const schema = makeExecutableSchema({ typeDefs, resolvers });

const app = express();

app.use('/graphql', bodyParser.json(), graphqlExpress({ schema }));

app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

app.use(webpackDevMiddleware(webpack({
  mode: 'development',
  entry: './client.jsx',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx']
  },
  output: {
    filename: 'build.js',
  },
})));

app.use(express.static('./static'));

app.listen(4200, () => console.log('listening...'));
