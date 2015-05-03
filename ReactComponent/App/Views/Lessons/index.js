'use strict';

var React = require('react-native');

var {
  Text,
  View,
  ListView,
} = React;

var styles = require("./style");
var LessonsManager = require('NativeModules').RPLessonsManager;

var ViewReactClass = React.createClass({
	getInitialState: function() {
		return {
			loaded: false,
			lessons: []
		};
	},
	componentDidMount: function() {
		var self = this;
    	LessonsManager.cachedLessons((error, cachedLessons) => {
    		self.setState({
    			loaded: true,
    			lessons: cachedLessons
    		});
    	});
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