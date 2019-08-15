import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";
import { check } from "meteor/check";

export const Events = new Mongo.Collection("events");

if (Meteor.isServer) {
  // This code only runs on the server
  // Only publish events that are public or belong to the current user
  Meteor.publish("events", function eventsPublication() {
    return Events.find({
      $or: [{ private: { $ne: true } }, { owner: this.userId }]
    });
  });
}

Meteor.methods({
  "events.insert"(text) {
    check(text, String);

    // Make sure the user is logged in before inserting a task
    if (!this.userId) {
      throw new Meteor.Error("not-authorized");
    }

    Events.insert({
      name: this.name,
      toDate: this.toDate,
      fromDate: this.fromDate,
      description: this.description,
      price: this.price,
      username: Meteor.users.findOne(this.userId).username
    });
  },

  "events.remove"(eventId) {
    check(eventId, String);

    const task = Events.findOne(eventId);
    if (task.private && task.owner !== this.userId) {
      // If the task is private, make sure only the owner can delete it
      throw new Meteor.Error("not-authorized");
    }

    Events.remove(eventId);
  }
});
