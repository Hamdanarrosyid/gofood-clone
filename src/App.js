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
  Redirect
} from "react-router-dom";
import Home from './pages/Home';
import Login from './pages/Login';
import ViewFood from './pages/ViewFood';
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
          <AuthRoute exact path={'/'} children={<Home />} />
          <AuthRoute path={'/food/:id'} children={<ViewFood/>}/>
          {/* <AuthRoute path={'/map'} children={<Map />} /> */}
          <GuestRoute path={'/login'} children={<Login />} />
          <Route path={'*'} component={NotFound} />
        </Switch>
      </Router>
    </ApolloProvider>
  );
}

const AuthRoute = ({ children, ...rest }) => {
  return (
    <Route {...rest}
      render={props => Cookies.get('token') ? (
        children
      ) : (
        <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
      )}
    />
  )
}
/**
 * @description GuestRoute adalah Route Component yang harus tidak memerlukan akses login
 * @param authRoute berisi props default Route Component
 * @returns Route component
 */
const GuestRoute = ({ children, ...rest }) => {
  return (
    <Route {...rest}
      render={props => Cookies.get('token') ? (
        <Redirect to={{ pathname: '/', state: { from: props.location } }} />
      ) : (
        children
      )}
    />
  )
}

const NotFound = () => {
  return (
    <h1 style={{color:'white'}}>Not Found</h1>
  )
}
export default App;