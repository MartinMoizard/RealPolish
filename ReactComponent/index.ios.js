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
        barTintColor='#E45C4E'
        titleTextColor='white'
        initialRoute={{
          title: 'Real Polish',
          component: LessonsView,
          backButtonTitle: 'Back'
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