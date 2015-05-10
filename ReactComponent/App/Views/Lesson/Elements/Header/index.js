'use strict';

var React = require('react-native');

var {
  Text,
  View,
  Image,
  TouchableOpacity,
} = React;

var styles = require("./style");

var HeaderView = React.createClass({
  render: function() {
    return (
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
    );
  },

  _onBackTapped: function() {
    this.props.navigator.pop();
  },
});

module.exports = HeaderView;