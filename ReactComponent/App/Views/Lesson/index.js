'use strict';

var React = require('react-native');

var styles = require("./style");

var {
  Text,
  View
} = React;

var ViewReactClass = React.createClass({
	getInitialState: function() {
		return {
		};
	},

	componentDidMount: function() {
  	},

  	componentWillUnmount: function() {
  	},

	render: function() {
		return(
	        	<View style={styles.container}>
	       		<Text style={styles.text}>
	         		{this.props.lesson.title}
	        	</Text>
	     		</View>
	      	);
	},
});

module.exports = ViewReactClass;