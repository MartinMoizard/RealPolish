'use strict';

var React = require('react-native');

var LessonStore = require('../../Stores/LessonStore');

var styles = require("./style");
var DownloadView = require("./Elements/Download")

var {
  Text,
  View,
  TouchableOpacity,
  Image,
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
					<View style={styles.header}>
						<View style={styles.backContainer}>
						<TouchableOpacity onPress={this._onBackTapped}>
          					<Image
            					style={styles.backButton}
            					source={require('image!back')} />
        				</TouchableOpacity>
        				</View>
        				<View style={styles.headerContent}>
	        				<Image
	        				  style={styles.lessonImage}
	        				  source={require('image!polishflag')} />
	        				<Text style={styles.lessonTitle}>
        						{this.props.lesson.title}
        					</Text>
        					<Text style={styles.lessonSubtitle}>
        						Lesson #{this.props.lesson.id}
        					</Text>
        				</View>

					</View>
		        	<Text style={styles.text}>	
		          		Lesson downloaded
		        	</Text>
      			</View>
			);
	},

	_onBackTapped: function() {
		this.props.navigator.pop();
	},
});

module.exports = ViewReactClass;