'use strict';

var React = require('react-native');

var {
  Text,
  View,
  TouchableHighlight
} = React;

var styles = require("./style");

var LessonCell = React.createClass({
  render: function() {
    return (
      <TouchableHighlight onPress={this.props.onSelect}>
      <View style={styles.container}>
        <Text style={styles.story}>
          {this.props.lesson.title}
        </Text>
        </View>
      </TouchableHighlight>
    );
  }
});

module.exports = LessonCell;