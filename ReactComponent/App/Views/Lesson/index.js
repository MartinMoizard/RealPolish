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
			downloaded: LessonStore.isDownloaded(this.props.lesson)
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
		if (!this.props.downloaded) {
			return this.renderDownloadView();
		} else {
			return this.renderLessonList();
		}
	},

	renderDownloadView: function() {
		return(
	        	<DownloadView lesson={this.props.lesson}/>
	      	);
	},

	renderLessonList: function() {

	}
});

module.exports = ViewReactClass;