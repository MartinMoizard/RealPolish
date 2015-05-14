'use strict';

var React = require('react-native');

var {
  View,
  Image,
} = React;

var styles = require("./style");

var HomeHeaderView = React.createClass({
  render: function() {
    return (
      <View style={styles.header}>
        <View style={styles.headerContent}>
        </View>
      </View>
    );
  },
});

module.exports = HomeHeaderView;