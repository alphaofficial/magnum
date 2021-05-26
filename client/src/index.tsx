import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import './styles/sidebar.css'
import reportWebVitals from './reportWebVitals';
import { Navigation } from './navigation';
import { Auth0Provider } from "@auth0/auth0-react"; 
import {ApolloProvider, ApolloClient, InMemoryCache, HttpLink, split} from '@apollo/react-hooks'
import {WebSocketLink} from '@apollo/client/link/ws'
import {getMainDefinition} from 'apollo-utilities'
import {AUTH_CID, AUTH_DOMAIN, API_URL, WS_URL} from './constants'


const wsLink = new WebSocketLink({
  uri: `${WS_URL}/graphql`,
  options: {
    timeout: 6000,
    reconnect: true
  }
});

const httpLink = new HttpLink({
  uri: `${API_URL}/graphql`,
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
    <Auth0Provider domain={AUTH_DOMAIN || ''} clientId={AUTH_CID || ''} redirectUri={window.location.origin}>
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
