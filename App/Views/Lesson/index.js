'use strict';

var React = require('react-native');

var LessonStore = require('../../Stores/LessonStore');

var styles = require("./style");
var lessonItems = require("./lessonItems");

var DownloadView = require("./Elements/Download");
var LessonItemCell = require("./Elements/ItemCell");
var HeaderView = require("./Elements/Header");
var PDFViewer = require("../PDFViewer");
var PlayerView = require("./Elements/Player")
var AudioPlayer = require('NativeModules').RPAudioPlayerManager;

var {
  Text,
  View,
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
				<View style={styles.container}>
					<HeaderView lesson={this.props.lesson} onBack={this._onBackTapped} />
					<DownloadView lesson={this.props.lesson} />
				</View>
	      	);
	},

	renderLessonList: function() {
		return (
				<View style={styles.container}>
					<HeaderView lesson={this.props.lesson} onBack={this._onBackTapped} />
					<ListView
						style={styles.itemsList}
        				dataSource={this.state.dataSource}
        				renderRow={this.renderLessonItemCell}
        				automaticallyAdjustContentInsets={false} />
        			<PlayerView />
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
		var self = this;
		var actionMapper = {
			0: function() { AudioPlayer.play(self.props.lesson.story) },
			1: function() { AudioPlayer.play(self.props.lesson.pov) },
			2: function() { AudioPlayer.play(self.props.lesson.qa) },
			3: function() {
				self.props.navigator.push({
			      component: PDFViewer,
			      passProps: {
			      	lesson: self.props.lesson,
			      	navigator: self.props.navigator
			      }
    			});
			}
		};
		var action = actionMapper[lessonItem.id];
		action();
	},

	_onChange: function() {
		this.setStateFromStore();
	},

	_onBackTapped: function() {
		AudioPlayer.stop();
		this.props.navigator.pop();
	},
});

module.exports = ViewReactClass;