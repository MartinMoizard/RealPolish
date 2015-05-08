'use strict';

var React = require('react-native');

var {
  Text,
  View,
  ListView,
} = React;

var styles = require("./style");
var LessonActionCreators = require('../../Actions/RealLessonActionCreators');
var NetworkManager = require('../../Network/NetworkManager');
var LessonStore = require('../../Stores/LessonStore');

function getStateFromStores() {
  return {
  	lessons: LessonStore.getAll(),
  	loaded: true
  };
}

function refreshLocalLessonsFromServer() {
	NetworkManager.getLessons(function(remoteLessons) {
		LessonActionCreators.receiveLessons(remoteLessons);
	}, function(error) {
		// Nothing to do, will be useful if adding a pull to refresh
	});
}

var ViewReactClass = React.createClass({
	getInitialState: function() {
		return {
			loaded: false,
			lessons: []
		};
	},

	componentDidMount: function() {
		LessonStore.addChangeListener(this._onChange);
		refreshLocalLessonsFromServer();
  	},

  	componentWillUnmount: function() {
    	LessonStore.removeChangeListener(this._onChange);
  	},

	render: function() {
		if (!this.state.loaded) {
			return(
	        	<View style={styles.container}>
	       		<Text style={styles.loadingText}>
	         		Fetching lessons...
	        	</Text>
	     		</View>
	      	);
		} else {
			return this.renderListView()
		}
	},

	renderListView: function() {
		return (
			<View style={styles.container}>
	       	<Text style={styles.loadingText}>
	        	{this.state.lessons[0].title}
	       	</Text>
	     	</View>
		);
	},

	_onChange: function() {
    	this.setState(getStateFromStores());
  	},
});

module.exports = ViewReactClass;