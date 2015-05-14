'use strict';

var React = require('react-native');

var {
  Text,
  View,
  Image,
  TouchableOpacity,
} = React;

var styles = require("./style");
var PDFView = require("./PDF");

var PDFViewer = React.createClass({
  render: function() {
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
      </View>
      <PDFView file={this.props.lesson.pdf} style={styles.pdf} />
      </View>
    );
  },

  _onBackTapped: function() {
    this.props.navigator.pop();
  },
});

module.exports = PDFViewer;