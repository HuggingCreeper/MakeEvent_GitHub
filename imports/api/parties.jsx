import {Meteor} from "meteor/meteor";
import {Mongo} from "meteor/mongo";
import {check} from "meteor/check";

export const Parties = new Mongo.Collection('parties');

if (Meteor.isServer) {
    // This code only runs on the server
    // Only publish parties that are public or belong to the current user
    Meteor.publish('parties', function partiesPublication() {
        return Parties.find({
            $or: [{private: {$ne: true}}, {owner: this.userId}]
        });
    });
}

Meteor.methods({
    'parties.lego'({newText}) {

        if (!this.userId) {
            throw new Meteor.Error("not-authorized");
        }

        Parties.insert({
            newText
        });
    },

    'parties.insert'({partyName, partyFromDate, partyToDate, partyDescription, partyPrice}) {
        // check(partyName, String);
        // check(partyFromDate, Date);
        // check(partyToDate, Date);
        // check(partyDescription, String);
        // check(partyPrice, BigInteger);

        // Make sure the user is logged in before inserting a task
        if (!this.userId) {
            throw new Meteor.Error("not-authorized");
        }

        Parties.insert({
            partyName,
            partyFromDate,
            partyToDate,
            partyDescription,
            partyPrice,
            username: Meteor.users.findOne(this.userId).username
        });
    },

    'parties.remove'(partyId) {
        check(partyId, String);

        const party = Parties.findOne(partyId);
        if (party.private && party.owner !== this.userId) {
            // If the task is private, make sure only the owner can delete it
            throw new Meteor.Error("not-authorized");
        }

        Parties.remove(partyId);
    }
});
