import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import gql from "graphql-tag";

import { ApolloProvider, useQuery } from '@apollo/react-hooks';

import Pages from './pages';
import Login from './pages/login';
import injectStyles from './styles';
import { resolvers, typeDefs } from './resolvers';

import React from 'react';
import ReactDOM from 'react-dom';
import Pages from './pages';

const cache = new InMemoryCache();
const link = new HttpLink({
    uri: 'http://localhost:4000/'
});
const IS_LOGGED_IN = gql`
    query IsUserLoggedIn {
        isLoggedIn @client
    }
`;

function IsLoggedIn() {
    const { data } = useQuery(IS_LOGGED_IN);
    return data.isLoggedIn ? <Pages /> : <Login />;
}

const client = new ApolloClient({
    cache,
    link: new HttpLink({
        uri: 'http://localhost:4000/graphql',
        headers: {
            authorization: localStorage.getItem('token'),
        },
    }),
    typeDefs,
    resolvers,
});

cache.writeData({
    data: {
        isLoggedIn: !!localStorage.getItem('token'),
        cartItems:[],
    },
});

client
  .query({
    query: gql`
      query GetLaunch {
        launch(id: 56) {
          idg
          mission {
            name
          }
        }
      }
    `
  })
  .then(result => console.log(result));

injectStyles();
  ReactDOM.render(
    <ApolloProvider client={client}>
      <IsLoggedIn />
    </ApolloProvider>,
    document.getElementById('root'),
  );