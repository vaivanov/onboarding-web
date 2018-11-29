import React from "react";
import {createBrowserHistory} from "history";
import {Router, Route, Switch} from "react-router-dom";
import {I18nextProvider} from "react-i18next";
import i18n from "./i18n";
import {ApolloClient} from 'apollo-client';
import {HttpLink} from 'apollo-link-http';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {ApolloProvider} from 'react-apollo';
import { setContext } from "apollo-link-context";
import Button from '@material-ui/core/Button';

import "assets/scss/material-kit-react.css?v=1.2.0";
import JSignIn from "./auth/JSignIn";
import Workspace from "./views/Workspace/Workspace";
import Onboarding from "./views/Onboarding/Onboarding";
import JSignOut from "./auth/JSignOut";

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
            isAuthenticated: false
        };
    }

    userHasAuthenticated = authenticated => {
        this.setState({ isAuthenticated: authenticated });
    };

    // TODO: Probably make SignOut a component
    logout = (event) => {
        event.preventDefault();
        // LogOut from AWS Cognito
        CognitoUserPoolWrapper.logout({
            "username": this.props.authenticatedUser,
            "idToken": this.props.authenticatedData.idToken,
            "accessToken": this.props.authenticatedData.accessToken
        }, (err, response) => {
            console.log("User Logged Out :" + JSON.stringify(response));
            if (response === "SUCCESS") {
                alert("User Logged out Successfully");
                this.props.signOut('signin');
                this.userHasAuthenticated(false);
            }
        });
    };

    render() {
        const childProps = {
            isAuthenticated: this.state.isAuthenticated,
            userHasAuthenticated: this.userHasAuthenticated
        };

        const {authData} = this.props;
        console.log('App props: ', this.props);
        console.log('App state: ', this.state);
        if (!authData) {
            return "Logging in failed: " + authData;
        }

        let uri = process.env.ONBOARDING_API || 'http://localhost:8086/graphql';
        console.log('ONBOARDING_API: ' + process.env.ONBOARDING_API);
        console.log('Using Onboarding API at ' + uri);

        const httpLink = new HttpLink({ uri: uri });
        const authLink = setContext(async (req, { headers }) => {
            let idToken = authData.idToken;
            // let accessToken = authenticatedData.accessToken;
            return {
                ...headers,
                headers: {
                    Authorization: `Bearer ${idToken}`
                },
            };
        });
        const link = authLink.concat(httpLink);
        const client = new ApolloClient({
            // By default, this client will send queries to the
            //  `/graphql` endpoint on the same host
            // Pass the configuration option { uri: YOUR_GRAPHQL_API_URL } to the `HttpLink` to connect
            // to a different host
            link: link,
            cache: new InMemoryCache(),
        });

        return (
            <div>
                <Button
                    label="Sign Out"
                    primary="true"
                    style={StyleSheet.button}
                    onClick={this.logout}
                    variant="contained"
                />
                {
                    <div>Hello, {authData.username}</div>
                }
                <JSignOut/>
                {
                    !this.state.isAuthenticated &&
                    <button onClick={this.props.OAuthSignIn}>
                        Sign in with AWS
                    </button>
                }
                <ApolloProvider client={client}>
                    <I18nextProvider i18n={i18n}>
                        <Router history={hist}>
                            <Switch>
                                <Route path="/login" key="Login" component={JSignIn} />;
                                <Route path="/workspace" key="Workspace" component={Workspace} />;
                                <Route path="/onboarding" key="Onboarding" render={props => <Onboarding {...props} {...childProps} />} />;
                            </Switch>
                        </Router>
                    </I18nextProvider>
                </ApolloProvider>,
            </div>
        )
    }
};
