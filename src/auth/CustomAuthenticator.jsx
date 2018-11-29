import React from "react";
import JSignIn from "./JSignIn";
import JSignUp from "./JSignUp";
import JForgotPassword from "./JForgotPassword";
import JForgotPasswordReset from "./JForgotPasswordReset";
import JConfirmSignIn from "./JConfirmSignIn";
import JConfirmSignUp from "./JConfirmSignUp";
import {Authenticator} from 'aws-amplify-react';

const AlwaysOn = (props) => {
    return (
        <div>
            <div>I am always here to show current auth state: {props.authState}</div>
            <button onClick={() => props.onStateChange('signIn')}>Show Sign In</button>
        </div>
    )
};

const CustomAuthenticator = () => (
    <Authenticator hideDefault>
        <JSignIn />
        <JSignUp />
        <JForgotPassword />
        <JForgotPasswordReset />
        <JConfirmSignIn />
        <JConfirmSignUp />
        <AlwaysOn/>
    </Authenticator>
);

export default CustomAuthenticator;