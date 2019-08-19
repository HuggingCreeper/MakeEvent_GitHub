import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Meteor} from 'meteor/meteor';
import {withTracker} from 'meteor/react-meteor-data';
import {Parties} from '../api/parties';
import Party from './Party';
import AccountsUIWrapper from './AccountsUIWrapper';

class Dashboard extends Component {
    loadParties() {
        return this.props.parties.map(party => {
            return (
                <Party
                    key={party._id}
                    id={party._id}
                    name={party.partyName}
                    toDate={party.partyToDate}
                    fromDate={party.partyFromDate}
                    description={party.partyDescription}
                    price={party.partyPrice}
                />
            );
        });
    }

    handleSubmit(event) {
        event.preventDefault();

        // Find the text field via the React ref
        const partyName = ReactDOM.findDOMNode(this.refs.partyName).value.trim();
        const partyFromDate = ReactDOM.findDOMNode(this.refs.partyFromDate).value.trim();
        const partyToDate = ReactDOM.findDOMNode(this.refs.partyToDate).value.trim();
        const partyDescription = ReactDOM.findDOMNode(this.refs.partyDescription).value.trim();
        const partyPrice = ReactDOM.findDOMNode(this.refs.partyPrice).value.trim();

        Meteor.call('parties.lego', {partyName});

        // Clear form
        ReactDOM.findDOMNode(this.refs.partyName).value = '';
    }


    render() {
        return (
            <div className="container">
                <header>
                    <h1>Create Event</h1>

                    <AccountsUIWrapper/>
                </header>

                {this.props.currentUser ?
                    <form className="new-party" onSubmit={this.handleSubmit.bind(this)}>
                        <input
                            type="text"
                            ref="partyName"
                            placeholder="Name your Event"
                        />
                        <input
                            type="date"
                            ref="partyFromDate"
                            placeholder="When will your Event start?"
                        />
                        <input
                            type="date"
                            ref="partyToDate"
                            placeholder="When will your Event end?"
                        />
                        <input
                            type="text"
                            ref="partyDescription"
                            placeholder="What is it about?"
                        />
                        <input
                            type="number"
                            ref="partyPrice"
                            placeholder="Price"
                        />
                        <input
                            type="submit"
                            value="Submit"
                        />
                    </form> : ''
                }

                <ul>{this.loadParties()}</ul>
            </div>
        );
    }
}

export default withTracker(() => {
    Meteor.subscribe("parties");

    return {
        parties: Parties.find({}, {sort: {createdAt: -1}}).fetch(),
        currentUser: Meteor.user()
    };
})(Dashboard);
