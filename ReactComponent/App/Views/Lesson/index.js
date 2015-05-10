'use strict';

var React = require('react-native');

var LessonStore = require('../../Stores/LessonStore');

var styles = require("./style");
var DownloadView = require("./Elements/Download")

var {
  Text,
  View
} = React;

var ViewReactClass = React.createClass({
	getStateFromStore: function() {
		return {
			downloaded: this.props.lesson.isDownloaded
		};
	},

	getInitialState: function() {
		return this.getStateFromStore();
	},

	componentDidMount: function() {
  	},

  	componentWillUnmount: function() {
  	},

	render: function() {
		if (this.state.downloaded === false) {
			return this.renderDownloadView();
		} else {
			return this.renderLessonList();
		}
	},

	renderDownloadView: function() {
		return (
	        	<DownloadView lesson={this.props.lesson}/>
	      	);
	},

	renderLessonList: function() {
		return (
				<View style={styles.container}>
		        <Text style={styles.text}>	
		          Lesson downloaded
		        </Text>
      			</View>
			);
	}
});

module.exports = ViewReactClass;