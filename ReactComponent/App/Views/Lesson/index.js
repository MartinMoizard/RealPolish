'use strict';

var React = require('react-native');

var LessonStore = require('../../Stores/LessonStore');

var styles = require("./style");
var DownloadView = require("./Elements/Download")

var {
  Text,
  View
} = React;

function getStateFromStore() {
	return {
		downloaded: LessonStore.isDownloaded(1)
	};
}

var ViewReactClass = React.createClass({
	getInitialState: function() {
		return getStateFromStore();
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
	        	<DownloadView />
	      	);
	},

	renderLessonList: function() {

	}
});

module.exports = ViewReactClass;