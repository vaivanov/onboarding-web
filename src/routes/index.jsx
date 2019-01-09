import React from 'react';
import Workspace from "views/Workspace/Workspace.jsx";
import Onboarding from "views/Onboarding/Onboarding.jsx";
import About from "views/about/About.jsx";
import Contact from "views/about/Contact.jsx";
import Terms from "views/legal/Terms.jsx";
import Privacy from "views/legal/Privacy.jsx";
import JSignIn from "../auth/JSignIn";
import App1 from "../../src/index"
import { withAuthenticator } from 'aws-amplify-react/dist/Auth';

import JSignUp from '../auth/JSignUp';
import JForgotPasswordReset from '../auth/JForgotPasswordReset';
import JConfirmSignIn from '../auth/JConfirmSignIn';
import JConfirmSignUp from '../auth/JConfirmSignUp';
import JForgotPassword from '../auth/JForgotPassword';

const SecuredApp = withAuthenticator(App1, false, [
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

export default [

    {path: "/about", exact:true, name: "Who are we", component: About},
    {path: "/contact", exact:true, name: "Contact us", component: Contact},
    {path: "/privacy", exact:true, name: "Privacy Statement", component: Privacy},
    {path: "/terms", exact:true, name: "Terms of Use", component: Terms},

    {path: "/workspace", exact:true, name: "Workspace", component: Workspace},
    {path: "/login", exact:true, name: "Login", component: Wrapped},
    {path: "/",exact:true, name: "Onboarding", component: Onboarding},

];
