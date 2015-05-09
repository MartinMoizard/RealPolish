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
  render: function() {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={this._onDownload}>
          <Image
            style={styles.image}
            source={require('image!download')} />
        </TouchableOpacity>
        <Text>
          Download
        </Text>
      </View>
    );
  },

  _onDownload: function() {
    LessonStore.download(this.props.lesson);
  }
});

module.exports = DownloadView;