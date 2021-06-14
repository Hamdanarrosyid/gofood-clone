import React from 'react';
// import logo from './logo.svg';
import './App.css';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
  split
} from "@apollo/client";
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import Home from './pages/Home';
import Login from './pages/Login';
import Map from './pages/Map';
import ViewFood from './pages/viewfood';
import Cookies from 'js-cookie';
import { setContext } from '@apollo/client/link/context'
import { getMainDefinition } from '@apollo/client/utilities';
import { WebSocketLink } from '@apollo/client/link/ws';

const wsLink = new WebSocketLink({
  uri: 'ws://https://dev-krby0u.microgen.id/graphql',
  options: {
    reconnect: true,
    connectionParams: {
      authToken: Cookies.get('token')
    },
  },
});

const httpLink = createHttpLink({
  uri: 'https://dev-krby0u.microgen.id/graphql'
})

const authLink = setContext((_, { headers }) => {
  const token = Cookies.get('token')
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ''
    }
  }
})

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  authLink.concat(httpLink),
);

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache()
})


function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/login" component={Login} />
          <Route path="/map" component={Map} />
          <Route path="/viewfood" component={ViewFood} />
        </Switch>
      </Router>
    </ApolloProvider>
  );
}

export default App;

{/* <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div> */}