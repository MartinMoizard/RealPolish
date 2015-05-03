'use strict';

var React = require('react-native');

var {
  Text,
  View,
  ListView,
} = React;

var styles = require("./style");

var ViewReactClass = React.createClass({
	getInitialState: function() {
		return {
			loaded: false
		};
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
			<View /> // Todo
		);
	},
});

module.exports = ViewReactClass;