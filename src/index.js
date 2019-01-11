import React from "react";
import ReactDOM from "react-dom";
import {Redirect} from 'react-router-dom'
import {createBrowserHistory} from "history";
import {Route, Router, Switch} from "react-router-dom";
import {I18nextProvider} from "react-i18next";
import i18n from "./i18n";
import {ApolloClient} from 'apollo-client';
import {HttpLink} from 'apollo-link-http';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {ApolloProvider} from 'react-apollo';
import {setContext} from "apollo-link-context";

import indexRoutes from "routes/index.jsx";
import "assets/scss/material-kit-react.css?v=1.2.0";

import Amplify from "aws-amplify";
import {withAuthenticator} from 'aws-amplify-react';

import JSignUp from "auth/JSignUp";
import JSignIn from "auth/JSignIn";
import JConfirmSignUp from "auth/JConfirmSignUp";
import JConfirmSignIn from "auth/JConfirmSignIn";
import JForgotPassword from "./auth/JForgotPassword";
import JForgotPasswordReset from "./auth/JForgotPasswordReset";

import CookieConsent from "react-cookie-consent";

import AWS from 'aws-sdk';

const environments = {
    "techoverflow-ta.aws.abnamro.org": {
        aws: {
            cognito: {
                region: "eu-west-1",
                userPoolId: "eu-west-1_BdgeG9u0R",
                userPoolWebClientId: "mm2l4fbterefsms3ots0vgmo6",
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
                userPoolId: "eu-west-1_oJjS9ieId",
                userPoolWebClientId: "61arbvommi7m6bishhq4jlrbd",
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
                userPoolId: "eu-west-1_oJjS9ieId",
                userPoolWebClientId: "61arbvommi7m6bishhq4jlrbd",
                domain: "techoverflow-d.auth.eu-west-1.amazoncognito.com",
                redirectSignIn: "http://localhost:3000/onboarding/signin",
                redirectSignOut: "http://localhost:3000/onboarding/logout",
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
console.log('Using Onboarding API at ' + uri);

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

let hist = createBrowserHistory();
const rootEl = document.querySelector("#root");

function isAttributeExist(attribute, value) {

    let _filterString = null;
    let  cognitoPromise = null;

    AWS.config.update({
        region: settings.aws.cognito.region, credentials: {
            'accessKeyId': "ASIA3PQN5P5I3DWSUP2D",
            'secretAccessKey': "t+DRiuR+d6hGgssu8mDznTQEfqMHSo3VS6CPyHPT", "sessionToken": "FQoGZXIvYXdzEFAaDDje/rSR8UkTAWvZRyLLAiyEQh+HJile7gcwi0vcHF8Y+FZ2VcQFM3gVfiHOOmfZLZbu3gr6up5Z5/UlPCZq8mh73AOgkOK+fSvtpeNqYoJkZZ3tfmzB5MWnwYUqlZ/GyIT92gcNMao0MVMDcDaBPKVIWmDAbkDdRcixrlB3mjT1DL3nhOEhM6wpEOvNZWrTPZHnp2UB9e935fV1bxCDIEZ2ToCn2ChAVRp4E81z669opp2QcyI/g/gYCvZEoob4YMfdYf5PxPYk3HjuQQxS37lCrdNWbRnlshICm90NAVSauS16c3FUqlX9dzvCcMSio9AePOENZrgQOefDD5kGJBUbXhi8dTFwOViGOJrGajyLmNrGKIesiqBVqm/9VK6GCAn2604+3dK3rQT1oZ9vlKOUZyzJR1yktnXLI9oWf4zfag5VcJ+87QaS1zvvPZ4aGIeL+H/5ryl9JYYo8rnd4QU="
        }
    });

    const cognitoidentityserviceprovider =
        new AWS.CognitoIdentityServiceProvider(
            { region: settings.aws.cognito.region, apiVersion: '2016-04-18' });

    switch (attribute) {
        case "email":
            _filterString = attribute + "=\"" + value + "\"";
            const emailParams = {
                UserPoolId: settings.aws.cognito.userPoolId, /* required */
                AttributesToGet: [
                    attribute
                ],
                Filter: _filterString
            };
            cognitoPromise = new Promise((resolve, reject) => {

                cognitoidentityserviceprovider.listUsers(emailParams, (err, data) => {
                    if (err) {
                        reject(false)
                    }
                    else {
                        resolve(data.Users.length !== 0 ? true : false);
                    }
                })
            });
            break;
        case "username":
            const usernameParams = {
                UserPoolId: settings.aws.cognito.userPoolId, /* required */
                Username: value
            };
            cognitoPromise = new Promise((resolve, reject) => {

                cognitoidentityserviceprovider.adminGetUser(usernameParams, (err, data) => {
                    if (err) {
                        resolve(false)
                    }
                    else {
                        resolve(true);
                    }
                })
            });
            break;
        default:
            cognitoPromise = null;
    }

    return cognitoPromise;

}
const App = class App extends React.Component {
    render() {
        const {auth, authData} = this.props;
        console.log('Auth: ', auth);
        console.log('Auth data: ', authData);
        if (!authData) {
            return "Logging in failed: " + (auth && auth.state);
        }

        const httpLink = new HttpLink({uri: uri});
        const authLink = setContext(async (req, {headers}) => {
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
                                    return <Redirect to='/'/>
                                }}/>
                                {indexRoutes.map((prop, key) => {
                                    return <Route path={prop.path} key={key} component={prop.component} listUsers={this.listUsers} />;
                                })}
                            </Switch>
                        </Router>
                    </I18nextProvider>
                </ApolloProvider>
                <CookieConsent
                    location="bottom"
                    buttonText="Accepteren"
                    cookieName="myAwesomeCookieName2"
                    style={{background: "#2B373B"}}
                    buttonStyle={{color: "#4e503b", fontSize: "13px"}}
                    expires={150}
                >
                    Deze website gebruikt cookies om te kunnen functioneren.{" "}
                    <span style={{fontSize: "10px"}}>
                        Door gebruik te maken van de site stemt u in met het plaatsen van dergelijke cookies
                        </span>
                </CookieConsent>
            </div>
        )
    }
};

const SecuredApp = withAuthenticator(App, false, [
    <JSignIn/>,
    <JSignUp isAttributeExist={isAttributeExist} />,
    <JForgotPassword/>,
    <JForgotPasswordReset/>,
    <JConfirmSignIn/>,
    <JConfirmSignUp/>,
]);

const Wrapped = [
    <SecuredApp className={"secure-app"}/>
];

ReactDOM.render(
    Wrapped,
    rootEl
);

export { isAttributeExist };
