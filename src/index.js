import React from "react";
import ReactDOM from "react-dom";

import "assets/scss/material-kit-react.css?v=1.2.0";

import Amplify from "aws-amplify";

import CustomAuthenticator from "auth/CustomAuthenticator";
import App from "App";

Amplify.configure({
    Auth: {
        region: 'eu-west-1',
        userPoolId: 'eu-west-1_WsTxYUHyC',
        userPoolWebClientId: '3nkh1qomocr39s893jf0dp44cd',
        mandatorySignIn: false,
        oauth: {
            awsCognito: {
                domain: 'smokefree-dev.auth.eu-west-1.amazoncognito.com',
                scope: ['email', 'openid'],
                redirectSignIn: 'http://localhost:3000/onboarding/signin',
                redirectSignOut: 'http://localhost:3000/onboarding/logout',
                // 'token' for Implicit grant, 'code' for Authorization code grant
                responseType: 'token',
            }
        }
    }
});

const rootEl = document.querySelector("#root");

ReactDOM.render(
    <App authenticator={CustomAuthenticator}/>,
    rootEl
);
