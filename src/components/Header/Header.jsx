import React from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// nodejs library to set properties for components
import PropTypes from "prop-types";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Hidden from "@material-ui/core/Hidden";
import Drawer from "@material-ui/core/Drawer";
import { NavLink } from 'react-router-dom';
// @material-ui/icons
import Menu from "@material-ui/icons/Menu";
// core components
import headerStyle from "assets/jss/material-kit-react/components/headerStyle.jsx";
import { Button } from "@material-ui/core";
/* import { withAuthenticator } from 'aws-amplify-react';

import JSignUp from "auth/JSignUp";
import JSignIn from "auth/JSignIn";
import JConfirmSignUp from "auth/JConfirmSignUp";
import JConfirmSignIn from "auth/JConfirmSignIn";
import JForgotPassword from "auth/JForgotPassword";
import JForgotPasswordReset from "auth/JForgotPasswordReset";
import App1 from "../../index"; */
import { Auth } from "aws-amplify";



class Header extends React.Component {

      constructor(props) {
        super(props);
        this.state = {
          mobileOpen: false,
        };
        this.handleDrawerToggle = this.handleDrawerToggle.bind(this);
        this.headerColorChange = this.headerColorChange.bind(this);

        

      }

      handleDrawerToggle() {
        this.setState({ mobileOpen: !this.state.mobileOpen });
      }

      signInClick = () => {
        console.log("User CLicks on Sign In....");
        this.props.history.push("/login");
      }
      componentDidMount() {
        if (this.props.changeColorOnScroll) {
          window.addEventListener("scroll", this.headerColorChange);
        }

      }
      headerColorChange() {
        const { classes, color, changeColorOnScroll } = this.props;
        const windowsScrollTop = window.pageYOffset;
        if (windowsScrollTop > changeColorOnScroll.height) {
          document.body
            .getElementsByTagName("header")[0]
            .classList.remove(classes[color]);
          document.body
            .getElementsByTagName("header")[0]
            .classList.add(classes[changeColorOnScroll.color]);
        } else {
          document.body
            .getElementsByTagName("header")[0]
            .classList.add(classes[color]);
          document.body
            .getElementsByTagName("header")[0]
            .classList.remove(classes[changeColorOnScroll.color]);
        }
      }
      componentWillUnmount() {
        if (this.props.changeColorOnScroll) {
          window.removeEventListener("scroll", this.headerColorChange);
        }
      }

      componentWillMount() {
        console.log("Header component will Mount");
      }

      componentWillUpdate() {
        console.log("Header component Will Update");
      }

      componentDidUpdate() {
        console.log("Header component Did Update");
      }

      
      render() {
        console.log("Header authenticatedUser ", this.props.authenticatedUser ," authData " , this.props.authData);
        const {
          classes,
          color,
          rightLinks,
          leftLinks,
          brand,
          fixed,
          absolute
        } = this.props;
        const appBarClasses = classNames({
          [classes.appBar]: true,
          [classes[color]]: color,
          [classes.absolute]: absolute,
          [classes.fixed]: fixed
        });
        const brandComponent = <NavLink to="/"><h1 className={"grunge-title"}>{brand}</h1></NavLink>;
        let signInButton = null;
        console.log("Header mode this.props.authenticatedUser: " + this.props.authenticatedUser);
        if (this.props.mode !== "authenticated") {
          signInButton = <Button
            onClick={() => this.signInClick()}
            className={"btn btn-highlight pr-25 pull-right"} >
            <span>Sign In</span>
          </Button>;
        } else {
          signInButton = <h6>Hi, { this.props.authenticatedUser ? this.props.authenticatedUser.username: null} </h6>;
        }

        
        return (
          <AppBar className={appBarClasses + " lm-header"}>
            <Toolbar className={classes.container}>
              {leftLinks !== undefined ? brandComponent : null}
              <div className={classes.flex}>
                {leftLinks !== undefined ? (
                  <Hidden smDown implementation="css">
                    {leftLinks}
                  </Hidden>
                ) : (
                    brandComponent
                  )}
              </div>
              <Hidden smDown implementation="css">
                {rightLinks}
              </Hidden>
              <Hidden mdUp>
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  onClick={this.handleDrawerToggle}
                >
                  <Menu  />
                </IconButton>
              </Hidden>
              {signInButton}
            </Toolbar>
            <Hidden mdUp implementation="css">
              <Drawer
                variant="temporary"
                anchor={"right"}
                open={this.state.mobileOpen}
                classes={{
                  paper: classes.drawerPaper
                }}
                onClose={this.handleDrawerToggle}
              >
                <div className={classes.appResponsive}>
                  {leftLinks}
                  {rightLinks}
                </div>
              </Drawer>
            </Hidden>

          </AppBar>
        );
  }
}

Header.defaultProp = {
  color: "white"
};

Header.propTypes = {
  classes: PropTypes.object.isRequired,
  color: PropTypes.oneOf([
    "primary",
    "info",
    "success",
    "warning",
    "danger",
    "transparent",
    "white",
    "rose",
    "dark"
  ]),
  rightLinks: PropTypes.node,
  leftLinks: PropTypes.node,
  brand: PropTypes.string,
  fixed: PropTypes.bool,
  absolute: PropTypes.bool,
  // this will cause the sidebar to change the color from
  // this.props.color (see above) to changeColorOnScroll.color
  // when the window.pageYOffset is heigher or equal to
  // changeColorOnScroll.height and then when it is smaller than
  // changeColorOnScroll.height change it back to
  // this.props.color (see above)
  changeColorOnScroll: PropTypes.shape({
    height: PropTypes.number.isRequired,
    color: PropTypes.oneOf([
      "primary",
      "info",
      "success",
      "warning",
      "danger",
      "transparent",
      "white",
      "rose",
      "dark"
    ]).isRequired
  })
};

export default withStyles(headerStyle)(Header);
