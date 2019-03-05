import React from "react";

import withStyles from "@material-ui/core/styles/withStyles";
import playgroundIconsStyle from "assets/jss/material-kit-react/components/playgroundIconsStyle.jsx";

import { playgroundIcons } from './playgroundIconsConstants';

class PlaygroundIcons extends React.PureComponent {

    renderIcon(icon) {
        const { classes } = this.props;

        return (
            <a className={classes.icon} key={icon.title}>
                <div
                    style={{
                        backgroundImage: `url(${icon.bg})`
                    }}
                    className={classes.iconBgImage}>
                    <div
                        style={{
                            backgroundImage: `url(${icon.icon})`
                        }}
                        className={classes.iconImage}
                    />
                </div>
                <div className={classes.iconTitle}>{icon.title}</div>
                <div className={classes.iconText}>{icon.text}</div>
            </a>
        );
    }

    render() {
        return playgroundIcons.map(icon => this.renderIcon(icon));
    }
}


export default withStyles(playgroundIconsStyle)(PlaygroundIcons);
