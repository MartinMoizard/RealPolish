'use strict';

var React = require('react-native');
var LessonStore = require('../../../../Stores/LessonStore');

var {
  Text,
  View,
  TouchableOpacity,
  Image,
} = React;

var styles = require("./style");

var DownloadView = React.createClass({
  setStateFromStore: function() {
    LessonStore.isDownloading(this.props.lesson, (downloadingCurrLesson, downloadingOtherLesson) => {
      this.setState({
        downloadingCurrLesson: downloadingCurrLesson,
        downloadingOtherLesson: downloadingOtherLesson
      });
    });
  },

  getInitialState: function() {
    return {
      downloadingCurrLesson: false,
      downloadingOtherLesson: false
    };
  },

  render: function() {
    if (this.state.downloadingCurrLesson) {
      return this.renderDownloadingView();
    } else if (this.state.downloadingOtherLesson) {
      return this.renderDownloadingOtherLessonView();
    } else {
      return this.renderDownloadView();
    }
  },

  renderDownloadingView: function() {
    return (
      <View style={styles.container}>
        <Image
          style={styles.image}
          source={require('image!download')} />
        <TouchableOpacity onPress={this._onDownload}>
          <Text style={styles.inprogress}>
            Download in progress...
          </Text>
        </TouchableOpacity>
      </View>
    );
  },

  renderDownloadingOtherLessonView: function() {
    return (
      <View style={styles.container}>
        <Image
          style={styles.image}
          source={require('image!download')} />
        <TouchableOpacity onPress={this._onDownload}>
          <Text style={styles.inprogress}>
            Please wait, another lesson is being downloaded...
          </Text>
        </TouchableOpacity>
      </View>
    );
  },

  renderDownloadView: function() {
    return (
      <View style={styles.container}>
        <Image
          style={styles.image}
          source={require('image!download')} />
        <TouchableOpacity onPress={this._onDownload}>
          <View style={styles.button}>
            <Text style={styles.text}>
              Download
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  },

  componentDidMount: function() {
    this.setStateFromStore();
    LessonStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    LessonStore.removeChangeListener(this._onChange);
  },

  _onDownload: function() {
    LessonStore.download(this.props.lesson);
  },

  _onChange: function() {
    this.setStateFromStore();
  }
});

module.exports = DownloadView;