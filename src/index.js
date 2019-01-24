import React from "react";
import ReactDOM from "react-dom";
import { Redirect } from 'react-router-dom'
// import {createBrowserHistory} from "history";
import { Route, Router, Switch } from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import { ApolloClient } from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloProvider } from 'react-apollo';
import { setContext } from "apollo-link-context";

import indexRoutes from "routes/index.jsx";
import "assets/scss/material-kit-react.css?v=1.2.0";

import Amplify from "aws-amplify";
import { withAuthenticator } from 'aws-amplify-react';

import JSignUp from "auth/JSignUp";
import JSignIn from "auth/JSignIn";
import JConfirmSignUp from "auth/JConfirmSignUp";
import JConfirmSignIn from "auth/JConfirmSignIn";
import JForgotPassword from "./auth/JForgotPassword";
import JForgotPasswordReset from "./auth/JForgotPasswordReset";

import CookieConsent from "react-cookie-consent";

import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk';
import rootReducer from './RootReducer';
import { publishEnvironment, publishGraphQLClient } from "./GlobalActions";
import { history } from "./setup";
import { environments } from "./config/environments";
import {} from 'dotenv/config';
const settings = environments[window.location.hostname] || environments["localhost"];
console.log("Host name is: " + window.location.hostname);
console.log("Using settings:", settings);

const uri = process.env.ONBOARDING_API || settings.api.onboarding;
console.log('Using Onboarding API at ' + uri);

// passing variables from .env
/* NODE_PARAM1 = value1
NODE_PARAM2 = value2
REACT_APP_PARAM1 = reactappparam1
REACT_APP_PARAM2 = reactappparam2 */
console.log("NODE_ENV " , process.env.NODE_ENV);

console.log("REACT_APP_SECRET_CODE " , process.env.REACT_APP_SECRET_CODE);

console.log("NODE_PARAM1 ", process.env.NODE_PARAM1);
console.log("NODE_PARAM2 ", process.env.NODE_PARAM2);
console.log("REACT_APP_PARAM1 ", process.env.REACT_APP_PARAM1);
console.log("REACT_APP_PARAM2 ", process.env.REACT_APP_PARAM2);
console.log("ONBOARDING_API ", process.env.ONBOARDING_API);
console.log("REACT_APP_ONBOARDING_API ", process.env.REACT_APP_ONBOARDING_API);
console.log("REACT_APP_MY_PORT ", process.env.REACT_APP_MY_PORT);

console.log("process.env ", process.env)


// IsAuthenticated can be called to see if user is authenticated
// const isAuthenticated = () => Amplify.Auth.user != null;
const oauth = {
    awsCognito: {
        domain: settings.aws.cognito.domain,
        scope: ['email', 'openid'],
        redirectSignIn: settings.aws.cognito.redirectSignIn,
        redirectSignOut: settings.aws.cognito.redirectSignOut,
        responseType: 'token', // 'token' for Implicit grant, 'code' for Authorization code grant
    }
};

Amplify.configure({
    Auth: {
        region: settings.aws.cognito.region,
        userPoolId: settings.aws.cognito.userPoolId,
        userPoolWebClientId: settings.aws.cognito.userPoolWebClientId,
        mandatorySignIn: false,
        oauth: oauth
    }
});

// Set up the Redux store
const store = createStore(rootReducer, applyMiddleware(thunk))
store.dispatch(publishEnvironment(settings))

// let hist = createBrowserHistory();
const rootEl = document.querySelector("#root");

const App = class App extends React.Component {
    render() {
        const { auth, authData } = this.props;
        console.log('Auth: ', auth);
        console.log('Auth data: ', authData);
        if (!authData) {
            return "Login failed: " + (auth && auth.state);
        }

        // const errorLink = onError(apolloError => {
        //     const graphQLErrors = apolloError.graphQLErrors;
        //     const networkError = apolloError.networkError;
        //     if (graphQLErrors) {
        //         graphQLErrors.map(({ message, locations, path, extensions }) =>
        //             console.log(`[GraphQL error]: Message: ${message}, Location: ${JSON.stringify(locations)}, Path: ${path}, Extensions: ${JSON.stringify(extensions)}`)

        //             // TODO: Consider using extensions.code === 'UNAUTHENTICATED' to trigger JWT refresh
        //         );
        //     }

        //     if (networkError) {
        //         console.log(`[Network error]: ${networkError}`);
        //     }
        // });
        const authLink = setContext(async (req, { headers }) => {
            let session = authData.getSignInUserSession();
            let idToken = session.getIdToken();
            let jwtToken = idToken.getJwtToken();
            return {
                ...headers,
                headers: {
                    Authorization: `Bearer ${jwtToken}`
                },
            };
        });
        const httpLink = new HttpLink({ uri: uri });
        const client = new ApolloClient({
            defaultOptions: {
                watchQuery: {
                    fetchPolicy: 'no-cache',                // We are not using graphQL caching, but keep the state in the Redux store instead
                    errorPolicy: 'all',
                },
                query: {
                    fetchPolicy: 'no-cache',                // We are not using graphQL caching, but keep the state in the Redux store instead
                    // fetchPolicy: 'network-only',
                    errorPolicy: 'all',
                },
                mutate: {
                    errorPolicy: 'all',
                },
            },
            link: ApolloLink.from([
                // errorLink,
                authLink,
                httpLink
            ]),
            cache: new InMemoryCache(),
            connectToDevTools: true,
        });

        store.dispatch(publishGraphQLClient(client))            // Register the graphQL client in the global state

        return (
            <div>
                <ApolloProvider client={client}>
                    <I18nextProvider i18n={i18n}>
                        <Router history={history}>
                            <Switch>
                                <Route exact path="/onboarding/logout" render={() => {
                                    console.log("User logged out, redirecting to map of the Netherlands.");
                                    return <Redirect to='/' />
                                }} />
                                {indexRoutes.map((prop, key) => {
                                    return <Route path={prop.path} key={key} component={prop.component} />;
                                })}
                            </Switch>
                        </Router>
                    </I18nextProvider>
                </ApolloProvider>
                <CookieConsent
                    location="bottom"
                    buttonText="Accepteren"
                    cookieName="CookiesAccepted"
                    style={{ background: "#2B373B" }}
                    buttonStyle={{ color: "#4e503b", fontSize: "13px" }}
                    expires={150}
                >
                    Deze website gebruikt cookies om te kunnen functioneren.{" "}
                    <span style={{ fontSize: "10px" }}>
                        Door gebruik te maken van de site stemt u in met het plaatsen van dergelijke cookies
                        </span>
                </CookieConsent>
            </div>
        )
    }
};

const SecuredApp = withAuthenticator(App, false, [
    <JSignIn />,
    <JSignUp />,
    <JForgotPassword />,
    <JForgotPasswordReset />,
    <JConfirmSignIn />,
    <JConfirmSignUp />,
]);



const Wrapped = [
    <Provider store={store}><SecuredApp className={"secure-app"} /></Provider>
];

ReactDOM.render(
    Wrapped,
    rootEl
);
