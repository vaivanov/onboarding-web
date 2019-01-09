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
import { Redirect} from 'react-router-dom';

import indexRoutes from "routes/index.jsx";
import "assets/scss/material-kit-react.css?v=1.2.0";

import JSignUp from "auth/JSignUp";
import JSignIn from "auth/JSignIn";
import JConfirmSignUp from "auth/JConfirmSignUp";
import JConfirmSignIn from "auth/JConfirmSignIn";
import JForgotPassword from "auth/JForgotPassword";
import JForgotPasswordReset from "auth/JForgotPasswordReset";

import {withAuthenticator} from 'aws-amplify-react';
// https://<your_domain>/login?response_type=token&client_id=<your_app_client_id>&redirect_uri=<your_callback_url>
// https://smokefree-dev.auth.eu-west-1.amazoncognito.com/login?response_type=token&client_id=3nkh1qomocr39s893jf0dp44cd&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fonboarding%2Fsignin

const poolData = {
    UserPoolId: "eu-west-1_WsTxYUHyC", // your user pool ID
    ClientId: '3nkh1qomocr39s893jf0dp44cd', // generated in the AWS console
    Paranoia: 7 // an integer between 1 - 10
};
const CognitoUserPoolWrapper = require('cognito-user-pool')(poolData);


let hist = createBrowserHistory();

const environments = {
    "techoverflow-ta.aws.abnamro.org": {
        aws: {
            cognito: {
                region: "eu-west-1",
                userPoolId: "eu-west-1_4AWqO0oP5",
                userPoolWebClientId: "6bi2jfnffr21jp1lbmchtomuoj",
                domain: "techoverflow-ta.auth.eu-west-1.amazoncognito.com",
                redirectSignIn: "https://techoverflow-ta.aws.abnamro.org/onboarding/signin",
                redirectSignOut: "https://techoverflow-ta.aws.abnamro.org/onboarding/logout",
            }
        },
        api: {
            onboarding: "https://techoverflow-ta.aws.abnamro.org/api/graphql"
        }
    },
    "techoverflow-d.aws.nl.eu.abnamro.com": {
        aws: {
            cognito: {
                region: "eu-west-1",
                userPoolId: "eu-west-1_JPnvWqFEH",
                userPoolWebClientId: "2lftl5v394apb7rb6ckcc59bus",
                domain: "techoverflow-d.auth.eu-west-1.amazoncognito.com",
                redirectSignIn: "https://techoverflow-d.aws.nl.eu.abnamro.com/onboarding/signin",
                redirectSignOut: "https://techoverflow-d.aws.nl.eu.abnamro.com/onboarding/logout",
            }
        },
        api: {
            onboarding: "https://techoverflow-d.aws.nl.eu.abnamro.com/api/graphql"
        }
    },
    "localhost": {
        aws: {
            cognito: {
                region: "eu-west-1",
                userPoolId: "eu-west-1_JPnvWqFEH",
                userPoolWebClientId: "2lftl5v394apb7rb6ckcc59bus",
                domain: "techoverflow-d.auth.eu-west-1.amazoncognito.com",
                redirectSignIn: "https://techoverflow-d.aws.nl.eu.abnamro.com/onboarding/signin",
                redirectSignOut: "https://techoverflow-d.aws.nl.eu.abnamro.com/onboarding/logout",
            }
        },
        api: {
            onboarding: "http://localhost:8086/api/graphql"
        }
    }
};
const settings = environments[window.location.hostname] || environments["localhost"];
console.log("Host name is: " + window.location.hostname);
console.log("Using settings:", settings);

const uri = process.env.ONBOARDING_API || settings.api.onboarding;
console.log('Using Onboarding API at dsasd ' + uri);

const App = class App extends React.Component {
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
            }
        });
    };

    render() {
        const {auth, authData} = this.props;
        console.log('Auth: ', auth);
        console.log('Auth data: ', authData);
        if (!authData) {
            //return "Logging in failed: " + (auth && auth.state);
        }

        const httpLink = new HttpLink({uri: uri});
        const authLink = setContext(async (req, {headers}) => {
            let session = authData && authData.getSignInUserSession();
            let idToken = authData &&  session.getIdToken();
            let jwtToken = authData &&  idToken.getJwtToken();
            return {
                ...headers,
                headers: {
                    Authorization: `Bearer ${jwtToken ? jwtToken: 'dsf.sdf.sdf'}`
                },
            };
        });
        const link = authLink.concat(httpLink);
        const client = new ApolloClient({
            link: link,
            cache: new InMemoryCache(),
        });

        return (
            <div>
                <ApolloProvider client={client}>
                    <I18nextProvider i18n={i18n}>
                        <Router history={hist}>
                            <Switch>
                               <Route exact path="/onboarding/logout" render={() => {
                                    console.log("User logged out, redirecting to map of the Netherlands.");
                                    return <Redirect to='/' />
                                }}/>
                               
                                <Route path="/login" exact key="Login"
                                       render={props => <CustomAuthenticator {...props} {...childProps} {...this.state}>  </CustomAuthenticator>}/>;
                                <Route path="/workspace" key="Workspace" component={Workspace}/>;
                                <Route path="/onboarding" exact key="Onboarding"
                                       render={props => <Onboarding {...props} {...childProps} {...this.state}/>}/>;
                            </Switch>
                        </Router>
                    </I18nextProvider>
                </ApolloProvider>
            </div>
        )
    }
};

const SecuredApp = withAuthenticator(App, false, [
    <JSignIn/>,
    <JSignUp/>,
    <JForgotPassword/>,
    <JForgotPasswordReset/>,
    <JConfirmSignIn/>,
    <JConfirmSignUp/>,
]);

const Wrapped = [
    <SecuredApp className={"secure-app"}/>
];

export default Wrapped;
