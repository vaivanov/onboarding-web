import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import {withNamespaces} from "react-i18next";
import componentsStyle from "assets/jss/material-kit-react/views/components.jsx";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import gql from "graphql-tag";
import {Mutation} from "react-apollo";
import {Link} from "react-router-dom";

const CREATE_INITIATIVE = gql`
    mutation CreateInitiative($input: CreateInitiativeInput!) {
        createInitiative(input: $input) {
            id
        }
    }
`;


class NewPlayground extends React.Component {
    constructor(props) {
        super(props);
        console.log("NewPlayground authenticated user: ", props.authenticatedUser);
        this.state = {
            name: "",
            lat: this.props.playground.latLng.lat(),
            lng: this.props.playground.latLng.lng(),
            initiativeId: 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                let r = Math.random() * 16 | 0, v = c === 'x' ? r : (r && 0x3 | 0x8);
                return v.toString(16);
            }),
            type: "smokefree",
            status: "not_started",
       };
        // Auth.currentAuthenticatedUser().then(user => {
        //     console.log('Current authenticated user: ', user);
        //     this.setState({user: user})
        // }).catch(err => {
        //     console.error('Not authenticated?', err);
        //     this.setState({user: null})
        // });
    }

    updateName = (eEvent) => {
        this.setState({
            name: eEvent.target.value
        });
    };

    render() {
        const {t, classes, authenticatedUser} = this.props;

        return (
            <>
                {!authenticatedUser && <Link to="/login">Login</Link>}
                {authenticatedUser &&
                <div>
                    <h2>Add a playground</h2>

                    <form className={classes.container}>
                        <TextField className={classes.textField} label="Playground name" pattern="/^\w{4,}$/"
                                   onKeyUp={this.updateName} defaultValue={this.state.name}/>
                    </form>
                    <Mutation mutation={CREATE_INITIATIVE}>
                        {(joinInitiative) => (
                            <Button onClick={() => joinInitiative({variables: {input: this.state}})}>
                                {t("onboarding.playground.calltoaction.button")}
                            </Button>
                        )}
                    </Mutation>
                </div>
                }
            </>
        );
    }
}

export default withStyles(componentsStyle)(
    withNamespaces("translations")(NewPlayground)
);
