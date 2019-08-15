import React, { Component } from "react";
import { Meteor } from "meteor/meteor";
import { withTracker } from "meteor/react-meteor-data";
import AccountsUIWrapper from "./AccountsUIWrapper";
import Event from "./Event";
import { Events } from "../api/events";

class Dashboard extends Component {
  loadEvents() {
    return this.props.events.map(event => {
      return (
        <Event
          key={event._id}
          id={event._id}
          name={event.name}
          toDate={event.toDate}
          fromDate={event.fromDate}
          description={event.description}
          price={event.price}
        />
      );
    });
  }

  render() {
    return (
      <div className="container">
        <header>
          <h1>Create Event</h1>

          <AccountsUIWrapper />
        </header>

        <ul>{this.loadEvents()}</ul>
      </div>
    );
  }
}

export default withTracker(() => {
  Meteor.subscribe("tasks");

  return {
    events: Events.find({}, { sort: { createdAt: -1 } }).fetch(),
    currentUser: Meteor.user()
  };
})(Dashboard);
