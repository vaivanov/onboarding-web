import React from "react";
import ReactDOM from "react-dom";
import { Redirect } from 'react-router-dom'
import { createBrowserHistory } from "history";
import { Route,  Router, withRouter, Switch } from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloProvider } from 'react-apollo';
import { setContext } from "apollo-link-context";
import WorkSpace from '../src/views/Workspace/Workspace';
import UserProfile from './components/UserProfile/UserProfile';
import "assets/scss/material-kit-react.css?v=1.2.0";

import Amplify from "aws-amplify";

import CustomAuthenticator from "./auth/CustomAuthenticator";
import Onboarding from "./views/Onboarding/Onboarding";
import { Auth } from "aws-amplify";

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
                userPoolId: "eu-west-1_oJjS9ieId",
                userPoolWebClientId: "61arbvommi7m6bishhq4jlrbd",
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

class App1 extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            authenticatedUser: null,
            authData: null,
            mode: 'guest', // guest or authencated
            user: null
            //client: this._unauthenticated_client()

        };
    }

    confirmUserDeletion = () => {
        console.log("confirmUserDeletion......");
        this.setState({
            authenticatedUser: null,
            authData: null,
            mode: "guest"
        });
    }

    signInHandler = (username, password) => {
        console.log("App1 button is clicked ");
        Auth.signIn(username, password)
            .then(user => {
                console.log("Auth.signIn is success ", user);
                this.setState({user: user, authenticatedUser: user, authData: user.signInUserSession ,mode: "authenticated"});
                //this.updateAuthenticatedUserandSession();
                //setTimeout(() => console.log("Done"), 3000);
                console.log("App1 signInHandler()");
                this.hist.push("/");
                
            })
            .catch(err => {/* this.signInError(err) */}); 
        
    }

    signOutHandler = () => {
        console.log("Clicked on Logout");
        this.setState({ mode: "guest" });
    }

    updateAuthenticatedUserandSession = () => {
        console.log("updateAuthenticatedUserandSession");
        if(this.state.authenticatedUser == null || this.state.authData) {
            Auth.currentAuthenticatedUser().then(user => {

                console.log('updateAuthenticatedUserandSession Auth.currentAuthenticatedUser():' + user);
                this.setState({
                    authenticatedUser: user,
                    //client: this._authenticated_client(user)
                })
            });
            Auth.currentSession()
            .then(data => {
                console.log("updateAuthenticatedUserandSession Auth.currentSession:" + JSON.stringify(data));
                this.setState({
                    authData: data
                });
            });
        }
       
    }
    

    componentWillMount() {
        console.log("App1 component will mount");
        if(this.state.authenticatedUser == null || this.state.authData == null) {
            Auth.currentAuthenticatedUser().then(user => {

                //console.log('Auth.currentAuthenticatedUser():' + user);
                this.setState({
                    authenticatedUser: user,
                    mode: 'authenticated',
                    //client: this._authenticated_client(user)
                })
            });
    
            Auth.currentSession()
                .then(data => {
                    //console.log("Auth.currentSession:" + JSON.stringify(data));
                    this.setState({
                        authData: data
                    });
                });
        }
    }

    componentWillUpdate() {
        console.log("App1 component will update");
        if(this.state.authenticatedUser == null || this.state.authData == null) {
            Auth.currentAuthenticatedUser().then(user => {

                //console.log('Auth.currentAuthenticatedUser():' + user);
                this.setState({
                    authenticatedUser: user,
                    mode: 'authenticated',
                    //client: this._authenticated_client(user)
                })
            });
    
            Auth.currentSession()
                .then(data => {
                    //console.log("Auth.currentSession:" + JSON.stringify(data));
                    this.setState({
                        authData: data
                    });
                });
        }
        
        
    }

    componentDidUpdate() {
        console.log("App1 component Did update");
    }

    componentDidMount() {
        console.log("App1 component Did mount");
    }

    

    render() {
        //const {auth, authData} = this.stat;
        console.log('App1 State Auth: ', this.state);
        if (!this.state.authData) {
            //return "Logging in failed: " + (auth && auth.state);
        }

        const httpLink = new HttpLink({ uri: uri });
        const authLink = setContext(async (req, { headers }) => {
           
            let jwtToken = this.state.authData && this.state.authData.idToken.jwtToken;
            let bearer = 'Bearer ' + jwtToken;

            return {
                ...headers,
                headers: {
                    Authorization: bearer
                },
            };
        });
        const link = authLink.concat(httpLink);
        const client = new ApolloClient({
            link: link,
            cache: new InMemoryCache(),
        });

        const childProps = {
            isAuthenticated: this.state.authenticatedUser !== null ? true : false,
            authenticatedUser: this.state.authenticatedUser
        };

        return (
            <div>
                <ApolloProvider client={client}>
                    <I18nextProvider i18n={i18n}>
                        <Router history={hist}>
                            <Switch>
                                {/* <Route
                                    path="/button"
                                    render={() => <div>
                                        <button onClick={this.signInHandler} >
                                            Sign In
                                                        </button>
                                        <button onClick={this.signOutHandler} >
                                            Log out
                                                        </button>{this.state.status}
                                    </div>}
                                /> */}

                                <Route
                                    exact
                                    path="/onboarding/logout"
                                    render={() => {
                                        console.log("User logged out, redirecting to map of the Netherlands.");
                                        return <Redirect to='/' />
                                    }
                                    }
                                />

                                <Route
                                    path="/login"
                                    exact
                                    key="Login"
                                    render={props => <CustomAuthenticator
                                        {...props}
                                        {...childProps}
                                        {...this.state}
                                        goForward={this.signInHandler}
                                        goBack={this.signOutHandler}>
                                    </CustomAuthenticator>
                                    }
                                />
                                <Route
                                    path="/workspace"
                                    key="Workspace"
                                    render={(props) => <WorkSpace
                                        {...props}
                                        {...this.state}
                                        {...childProps}
                                        goForward={this.signInHandler}
                                        goBack={this.signOutHandler}
                                        Auth={Auth}
                                    />
                                    }
                                />
                                <Route
                                    path="/user/profile"
                                    key="UserProfile"
                                    exact
                                    render={
                                        (props) => <UserProfile
                                            {...props}
                                            {...this.state}
                                            {...childProps}
                                            goForward={this.signInHandler}
                                            goBack={this.signOutHandler}
                                            confirmUserDeletion={this.confirmUserDeletion}
                                        />

                                    }
                                />

                                <Route
                                    path="/"
                                    exact
                                    key="Onboarding"
                                    render={(props) => <Onboarding
                                        {...props}
                                        {...this.state}
                                        {...childProps}
                                        goForward={this.signInHandler}
                                        goBack={this.signOutHandler}
                                        Auth={Auth}
                                    />
                                    }
                                />
                            </Switch>
                        </Router>
                    </I18nextProvider>
                </ApolloProvider>
            </div>
        )
    }
};



ReactDOM.render(
    <App1 />,
    rootEl
);

export default withRouter(App1);