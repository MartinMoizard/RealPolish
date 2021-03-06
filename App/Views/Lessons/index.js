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
var HomeHeaderView = require("./Elements/HomeHeader")
var LessonView = require("../Lesson")

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
		var self = this;
		LessonStore.getCached(function(cachedLessons) {
			LessonStore.addChangeListener(self._onChange);

			if (cachedLessons.length) {
				LessonActionCreators.receiveLessons(cachedLessons);
			}

			refreshLocalLessonsFromServer();
		});
  	},

  	componentWillUnmount: function() {
    	LessonStore.removeChangeListener(this._onChange);
  	},

	render: function() {
		if (!this.state.loaded) {
			return(
	        	<View style={styles.container}>
	        		<HomeHeaderView />
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
				<HomeHeaderView />
				<ListView
	        		dataSource={this.state.dataSource}
	        		renderRow={this.renderLessonCell}
	        		style={styles.lessonsListView}
	        		automaticallyAdjustContentInsets={false} />
        	</View>
		);
	},

	renderLessonCell: function(lesson) {
	    return (
	    	<LessonCell
	    	onSelect={() => this.selectLesson(lesson)}
	        lesson={lesson} />
	    );
	},
	
	selectLesson: function (lesson) {
		this.props.navigator.push({
	      title: lesson.title,
	      component: LessonView,
	      passProps: {lesson: lesson}
    	});
	},

	_onChange: function() {
    	this.setState(this.getStateFromStores());
  	},
});

module.exports = ViewReactClass;