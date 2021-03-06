import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Meteor} from 'meteor/meteor';
import {withTracker} from 'meteor/react-meteor-data';
import {Tasks} from '../api/tasks';
import Task from './Task';
import AccountsUIWrapper from './AccountsUIWrapper';

// App component - represents the whole app
class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            hideCompleted: false,
        };
    }

    handleSubmit(event) {
        event.preventDefault();

        // Find the text field via the React ref
        const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();
        const description = ReactDOM.findDOMNode(this.refs.descriptionInput).value.trim();

        Meteor.call('tasks.insert', {text, description});

        // Clear form
        ReactDOM.findDOMNode(this.refs.textInput).value = '';
        ReactDOM.findDOMNode(this.refs.descriptionInput).value = '';
    }

    toggleHideCompleted() {
        this.setState({
            hideCompleted: !this.state.hideCompleted,
        });
    }

    renderTasks() {
        let filteredTasks = this.props.tasks;
        if (this.state.hideCompleted) {
            filteredTasks = filteredTasks.filter(task => !task.checked);
        }
        return filteredTasks.map((task) => {
            const currentUserId = this.props.currentUser && this.props.currentUser._id;
            const showPrivateButton = task.owner === currentUserId;

            return (
                <Task
                    key={task._id}
                    id={task._id}
                    text={task.text}
                    description={task.description}
                    username={task.username}
                    checked={task.checked}
                    private={task.private}
                    showPrivateButton={showPrivateButton}
                />
            );
        });
    }

    render() {
        return (
            <div className="container">
                <header>
                    <h1>Todo List ({this.props.incompleteCount})</h1>

                    <label className="hide-completed">
                        <input
                            type="checkbox"
                            readOnly
                            checked={this.state.hideCompleted}
                            onClick={this.toggleHideCompleted.bind(this)}
                        />
                        Hide Completed Tasks
                    </label>

                    <AccountsUIWrapper/>

                    {this.props.currentUser ?
                        <form className="new-task" onSubmit={this.handleSubmit.bind(this)}>
                            <input
                                type="text"
                                ref="textInput"
                                placeholder="Type to add new tasks"
                            />
                            <input
                                type="description"
                                ref="descriptionInput"
                                placeholder="Descrip it"
                            />
                            <input
                                type="submit"
                                value="Submit"
                            />
                        </form> : ''
                    }
                </header>

                <ul>
                    {this.renderTasks()}
                </ul>
            </div>
        );
    }
}

export default withTracker(() => {
    Meteor.subscribe('tasks');

    return {
        tasks: Tasks.find({}, {sort: {createdAt: -1}}).fetch(),
        incompleteCount: Tasks.find({checked: {$ne: true}}).count(),
        currentUser: Meteor.user(),
    };
})(App);
