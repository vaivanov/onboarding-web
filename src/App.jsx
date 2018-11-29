import React from "react";
import {createBrowserHistory} from "history";
import {Route, Router, Switch} from "react-router-dom";
import {I18nextProvider} from "react-i18next";
import i18n from "./i18n";
import {HttpLink} from 'apollo-link-http';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {ApolloProvider} from 'react-apollo';
import "assets/scss/material-kit-react.css?v=1.2.0";
import JSignOut from "./auth/JSignOut";
import Workspace from "./views/Workspace/Workspace";
import Onboarding from "./views/Onboarding/Onboarding";
import {Auth} from "aws-amplify";

import CustomAuthenticator from "auth/CustomAuthenticator";
import ApolloClient from "apollo-client/ApolloClient";
import {setContext} from "apollo-link-context";

// https://<your_domain>/login?response_type=token&client_id=<your_app_client_id>&redirect_uri=<your_callback_url>
// https://smokefree-dev.auth.eu-west-1.amazoncognito.com/login?response_type=token&client_id=3nkh1qomocr39s893jf0dp44cd&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fonboarding%2Fsignin

const poolData = {
    UserPoolId: "eu-west-1_WsTxYUHyC", // your user pool ID
    ClientId: '3nkh1qomocr39s893jf0dp44cd', // generated in the AWS console
    Paranoia: 7 // an integer between 1 - 10
};
const CognitoUserPoolWrapper = require('cognito-user-pool')(poolData);


let hist = createBrowserHistory();

export default class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            user: null,
            client: this._unauthenticated_client()
        };

        Auth.currentAuthenticatedUser().then(user => {
            console.log('Current authenticated user: ', user);
            this.setState({
                authenticatedUser: user,
                client: this._authenticated_client(user)
            })
        });
        // TODO: Listen to login & logout events to update user...
    }

    _unauthenticated_client = () => {
        console.info("Using unauthenticated Graphql client");

        let uri = process.env.ONBOARDING_API || 'http://localhost:8086/graphql';
        console.log('ONBOARDING_API: ' + process.env.ONBOARDING_API);
        console.log('Using Onboarding API at ' + uri);

        const link = new HttpLink({uri: uri});

        return new ApolloClient({
            // By default, this client will send queries to the
            //  `/graphql` endpoint on the same host
            // Pass the configuration option { uri: YOUR_GRAPHQL_API_URL } to the `HttpLink` to connect
            // to a different host
            link: link,
            cache: new InMemoryCache(),
        });
    };

    _authenticated_client = (/*CognitoUser*/user) => {
        console.info("Using authenticated Graphql client");

        let uri = process.env.ONBOARDING_API || 'http://localhost:8086/graphql';
        console.log('ONBOARDING_API: ' + process.env.ONBOARDING_API);
        console.log('Using Onboarding API at ' + uri);
        console.log('User is: ', user);

        const tokens = user.signInUserSession;
        const httpLink = new HttpLink({uri: uri});
        const authLink = setContext(async (req, {headers}) => {
            let idToken = tokens.idToken.jwtToken;
            // let accessToken = authenticatedUser.accessToken;
            return {
                ...headers,
                headers: {
                    Authorization: `Bearer ${idToken}`
                },
            };
        });
        const link = authLink.concat(httpLink);

        return new ApolloClient({
            link: link,
            cache: new InMemoryCache(),
        });
    };

    render() {
        const childProps = {
            isAuthenticated: !this.state.authenticatedUser,
            authenticatedUser: this.state.authenticatedUser
        };

        console.log('App props: ', this.props);
        console.log('App state: ', this.state);

        return (
            <div>
                <JSignOut/>
                <ApolloProvider client={this.state.client}>
                    <I18nextProvider i18n={i18n}>
                        <Router history={hist}>
                            <Switch>
                                <Route path="/login" exact key="Login"
                                       render={props => <CustomAuthenticator {...props} {...childProps} />}/>;
                                <Route path="/workspace" key="Workspace" component={Workspace}/>;
                                <Route path="/onboarding" exact key="Onboarding"
                                       render={props => <Onboarding {...props} {...childProps} />}/>;
                            </Switch>
                        </Router>
                    </I18nextProvider>
                </ApolloProvider>,
            </div>
        )
    }
};
