import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import './styles/sidebar.css'
import reportWebVitals from './reportWebVitals';
import { Navigation } from './navigation';
import { Auth0Provider } from "@auth0/auth0-react";
import config from './config.json'
import {ApolloProvider, ApolloClient, InMemoryCache, HttpLink, split} from '@apollo/react-hooks'
import {WebSocketLink} from '@apollo/client/link/ws'
import {getMainDefinition} from 'apollo-utilities'
import {SubscriptionClient} from 'subscriptions-transport-ws'


const wsLink = new WebSocketLink({
  uri: 'ws://localhost:5600/graphql',
  options: {
    timeout: 6000,
    reconnect: true
  }
});

const httpLink = new HttpLink({
  uri: 'http://localhost:4000/graphql',
});

const link = split(
  // split based on operation type
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);

const client = new ApolloClient({
  link,
  cache: new InMemoryCache()
});

ReactDOM.render(
  <React.StrictMode>
    <Auth0Provider domain={config.AUTH_DOMAIN} clientId={config.AUTH_CLIENTID} redirectUri={window.location.origin}>
    <ApolloProvider client={client}>
      <Navigation />
    </ApolloProvider>
    </Auth0Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
