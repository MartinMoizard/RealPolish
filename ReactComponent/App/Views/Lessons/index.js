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
var LessonCell = require("./Elements/LessonCell")

function refreshLocalLessonsFromServer() {
	NetworkManager.getLessons(function(remoteLessons) {
		LessonActionCreators.receiveLessons(remoteLessons);
	}, function(error) {
		// Nothing to do, will be useful if adding a pull to refresh
	});
}

var ViewReactClass = React.createClass({
	getStateFromStores: function() {
  		return {
  			dataSource: this.state.dataSource.cloneWithRows(LessonStore.getAll()),
  			loaded: true
  		};
	},

	getInitialState: function() {
		return {
			dataSource: new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2}),
			loaded: false
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
			<ListView
        		dataSource={this.state.dataSource}
        		renderRow={this.renderLessonCell}
        		style={styles.lessonsListView} />
		);
	},

	renderLessonCell: function(lesson) {
	    return(
	    	<LessonCell
	    	onSelect={() => this.selectLesson(lesson)}
	        lesson={lesson} />
	    );
	},
	
	selectLesson: function () {

	},

	_onChange: function() {
    	this.setState(this.getStateFromStores());
  	},
});

module.exports = ViewReactClass;