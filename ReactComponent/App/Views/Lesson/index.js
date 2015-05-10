'use strict';

var React = require('react-native');

var LessonStore = require('../../Stores/LessonStore');

var styles = require("./style");
var lessonItems = require("./lessonItems");

var DownloadView = require("./Elements/Download");
var LessonItemCell = require("./Elements/ItemCell");

var {
  Text,
  View,
  TouchableOpacity,
  Image,
  ListView,
} = React;

var ViewReactClass = React.createClass({
	getStateFromStore: function() {
		if (this.props.lesson.isDownloaded) {
			var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
			return {
				downloaded: true,
				dataSource: ds.cloneWithRows(lessonItems)
			};
		} else {
			return {
				downloaded: false
			};
		}
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
						<TouchableOpacity onPress={this._onBackTapped}>
						<View style={styles.backContainer}>
          					<Image
            					style={styles.backButton}
            					source={require('image!back')} />
        				</View>
        				</TouchableOpacity>
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
					<ListView
						style={styles.itemsList}
        				dataSource={this.state.dataSource}
        				renderRow={this.renderLessonItemCell}
        				automaticallyAdjustContentInsets={false} />
		        	<Text style={styles.text}>	
		          		Lesson downloaded
		        	</Text>
      			</View>
			);
	},

	renderLessonItemCell: function(itemInfo) {
		return (
			<LessonItemCell
	    	onSelect={() => this._onSelectLessonItem(itemInfo)}
	        itemInfo={itemInfo} />
		);
	},

	_onSelectLessonItem: function(lessonItem) {

	},

	_onBackTapped: function() {
		this.props.navigator.pop();
	},
});

module.exports = ViewReactClass;