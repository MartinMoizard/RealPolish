'use strict';

var React = require('react-native');

var {
  AppRegistry,
  StyleSheet,
  NavigatorIOS,
} = React;

var LessonsView = require('./App/Views/Lessons');

var RealPolish = React.createClass({
  render: function() {
    return (
      <NavigatorIOS
        style={styles.container}
        barTintColor='#B11E26'
        titleTextColor='white'
        initialRoute={{
          title: 'Real Polish',
          component: LessonsView,
        }}/>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

React.AppRegistry.registerComponent('RealPolish', () => RealPolish);