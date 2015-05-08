'use strict';

var React = require('react-native');

var {
  Text,
  View,
  ListView,
} = React;

var styles = require("./style");
var LessonsManager = require('NativeModules').RPLessonsManager;
var NetworkManager = require('../../Network/NetworkManager');
var LessonActionCreators = require('../../Actions/RealLessonActionCreators');

var ViewReactClass = React.createClass({
	getInitialState: function() {
		return {
			loaded: false,
			lessons: []
		};
	},
	componentDidMount: function() {
		var self = this;
		NetworkManager.getLessons(function(remoteLessons) {
			LessonActionCreators.receiveLessons(remoteLessons);
		}, function(error) {
			// Nothing to do, will be useful if adding a pull to refresh
		});
    /*	LessonsManager.cachedLessons((error, cachedLessons) => {
    		if (!error) {
	    		self.setState({
	    			loaded: true,
	    			lessons: cachedLessons
	    		});
    		}
    	});
    */
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
});

module.exports = ViewReactClass;