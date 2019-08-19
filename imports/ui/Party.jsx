import React, { Component } from "react";
import { Meteor } from "meteor/meteor";
import classnames from "classnames";

// Task component - represents a single todo item
export default class Party extends Component {
    render() {
        return (
            <li>{this.props.name}</li>
        );
    }
}
