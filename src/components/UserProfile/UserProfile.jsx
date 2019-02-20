import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControlLabel, FormGroup, Switch, TextField } from "@material-ui/core";
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React from "react";
import Footer from '../Footer/Footer';
import Header from '../Header/Header';
import HeaderLinks from "../Header/HeaderLinks";
const styles = theme => ({
    root: {
        ...theme.mixins.gutters(),
        marginTop: theme.spacing.unit * 10,

        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
        display: "flex-center"

    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 300
    },
    paper: {
        maxWidth: 800,
        minHeight: 600,
        padding: theme.spacing.unit * 2,
        margin: "auto"
    },
    flex: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
    },
    flex1: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center"
    },

    Dbutton: {
        margin: theme.spacing.unit,
        backgroundColor: '#c73146',
        color: 'white'
    },
    Ebutton: {
        margin: theme.spacing.unit,
        backgroundColor: '#2D519A',
        color: 'white'
    },
});

class UserProfile extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            deleteConfirmation: {
                open: false,
            }
        };

    }
    // user.signInUserSession.accessToken.jwtToken
    /* componentWillMount() {
        if (false) {
            this.props.history.push("/login")
        } else {
            Auth.currentUserInfo()
                .then(res => {
                    console.error(res.username);
                    console.error(res.attributes.email);
                    this.setState({
                        user: res
                    })
                    this.setState({
                        user: { username: res.username, email: res.attributes.email }
                    });
                })
                .catch(err => {
                    console.error(err);
                });
        }

    } */

    changeInput = name => event => {
        console.log("Changed Control");
    };

    deleteConfirm = event => {
        
        this.props.authenticatedUser.deleteUser((err, data) => {
            if (err) {
                console.log("Something went wrong deleting user, please try again after sometime.");
                return;
            }
            this.props.confirmUserDeletion();
            console.log('User Deleted ' + data);
        });
        this.setState(state => ({
            deleteConfirmation: {
                open: !state.deleteConfirmation.open,
            }
        }));
        this.props.history.push("/");

    };

    deleteAccount = event => {
        this.setState(state => ({
            deleteConfirmation: {
                open: !state.deleteConfirmation.open,
            }
        }));

    };

    cancelDeletionConfirmation = (event) => {
        this.setState(state => ({
            deleteConfirmation: {
                open: !state.deleteConfirmation.open,
            }
        }));
    }

    updateProfile = (event) => {
        this.setState(state => ({
            deleteConfirmation: {
                open: !state.deleteConfirmation.open,
            }
        }));

    }

    closeDialog = () => {
        this.setState(state => ({
            deleteConfirmation: {
                open: !state.deleteConfirmation.open,
            }
        }));
    }
    histroyhistroyhistroyhistroyhistroyhistroyhistroy
    render = () => {
        const { classes, authenticatedUser, history, ...rest } = this.props;
        const { deleteConfirmation} = this.state;
        const id = deleteConfirmation.open ? 'delete-confirmation-popup' : null;
        console.log("User Profile  :", this.state.user, history);
        return (
            <div className={classes.root}>
                <Header
                    brand={"Rookvrije generatie"}
                    rightLinks={<HeaderLinks mode={this.props.mode} />}
                    fixed
                    color="white"
                    changeColorOnScroll={{
                        height: 50,
                        color: "white"
                    }}
                    {...rest}
                    goBack={this.props.goBack}
                    goForward={this.props.goForward}
                    status={this.props.status}
                    mode={this.props.mode}
                />
                <Paper className={classes.paper} {...rest} elevation={2} >
                    <Typography variant="h4" component="h3" className={classes.flex} >
                        User Information
                    </Typography>
                    <Typography component="div">
                        <form noValidate autoComplete="off" className={classes.flex}>
                            <TextField
                                id="standard-name"
                                label="User Name"
                                className={classes.textField}
                                value={authenticatedUser.username}
                                onChange={this.changeInput("name")}
                                margin="normal"
                            />
                            <TextField
                                id="standard-name"
                                label="Email"
                                className={classes.textField}
                                value={authenticatedUser.attributes.email}
                                onChange={this.changeInput("email")}
                                margin="normal"
                            />

                            <FormGroup row>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={authenticatedUser.attributes.email_verified}
                                            value="checkedA"
                                        />
                                    }
                                    label="Email Verified"
                                />
                            </FormGroup>
                            <div className={classes.flex1}>
                                <Button variant="contained" className={classes.Ebutton} onClick={this.updateProfile}>
                                    Update
                                </Button>
                                <Button aria-describedby={id} variant="contained" className={classes.Dbutton} onClick={this.deleteAccount}>
                                    Delete Account
                                </Button>
                            </div>

                            <Dialog
                                open={deleteConfirmation.open}
                                onClose={this.closeDialog}
                                aria-labelledby="alert-dialog-title"
                                aria-describedby="alert-dialog-description"
                            >
                                <DialogTitle id="alert-dialog-title">{"Are you sure you want to delete your account?"}</DialogTitle>
                                <DialogContent>
                                    <DialogContentText id="alert-dialog-description">
                                    Deleting your account will disable your profile and removes name, etc from Playground Workspace. 
                                    Please do choose admin for Playgrounds where you are Admin.
                                </DialogContentText>
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={this.cancelDeletionConfirmation} className={classes.Dbutton}>
                                        Cancel Deletion
                                    </Button>
                                    <Button onClick={this.deleteConfirm} color="primary"  className={classes.Ebutton} autoFocus>
                                        Confirm Deletion
                                    </Button>
                                </DialogActions>
                            </Dialog>

                        </form>
                    </Typography>
                </Paper>
                <Footer />
            </div>
        );
    }
}
export default withStyles(styles)(UserProfile);