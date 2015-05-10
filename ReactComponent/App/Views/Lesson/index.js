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
	setStateFromStore: function() {
		LessonStore.isDownloaded(this.props.lesson, result => {
			if (result === true) {
				this.setState({
					loading: false,
					downloaded: true,
					dataSource: this.state.dataSource.cloneWithRows(lessonItems)
				});
			} else {
				this.setState({
					loading: false,
					downloaded: false,
					dataSource: this.state.dataSource
				});
			}
		});
	},

	getInitialState: function() {
		return {
			loading: true,
			downloaded: false,
			dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
		};
	},

	componentDidMount: function() {
		LessonStore.addChangeListener(this._onChange);
  	},

  	componentWillUnmount: function() {
  		LessonStore.removeChangeListener(this._onChange);
  	},

	render: function() {
		if (this.state.loading === true) {
			return this.renderLoadingView();
		} else if (this.state.downloaded === false) {
			return this.renderDownloadView();
		} else {
			return this.renderLessonList();
		}
	},

	renderLoadingView: function() {
		this.setStateFromStore();
		return (
				<View />
			);
	},

	renderDownloadView: function() {
		return (
	        	<DownloadView lesson={this.props.lesson} />
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

	_onChange: function() {
		this.setStateFromStore();
	},
});

module.exports = ViewReactClass;