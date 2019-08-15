import React, { Component } from "react";
import { Meteor } from "meteor/meteor";
import classnames from "classnames";

// Task component - represents a single todo item
export default class Task extends Component {
  toggleChecked() {
    Meteor.call("tasks.setChecked", this.props.id, !this.props.checked);
  }

  deleteThisTask() {
    Meteor.call("tasks.remove", this.props.id);
  }

  togglePrivate() {
    Meteor.call("tasks.setPrivate", this.props.id, !this.props.private);
  }

  render() {
    const taskClassName = classnames({
      checked: this.props.checked,
      private: this.props.private
    });

    return (
      <li className={taskClassName}>
        <input
          type="checkbox"
          readOnly
          checked={!!this.props.checked}
          onClick={this.toggleChecked.bind(this)}
        />

        {this.props.showPrivateButton ? (
          <button
            className="toggle-private"
            onClick={this.togglePrivate.bind(this)}
          >
            {this.props.private ? "Private" : "Public"}
          </button>
        ) : (
          ""
        )}

        <span className="text">
          <strong>{this.props.username}</strong>: {this.props.text}
        </span>

        <button className="delete" onClick={this.deleteThisTask.bind(this)}>
          &times;
        </button>
      </li>
    );
  }
}
