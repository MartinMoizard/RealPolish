'use strict';

var React = require('react-native');

var {
  StyleSheet,
} = React;

module.exports = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    backgroundColor: '#E57468',
    height: 64,
  },

  backContainer: {
    marginTop: 20,
    height: 38,
    width: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },

  backButton: {
    height: 18,
    width: 12,
    alignSelf: 'center'
  },

  pdf: {
    flex: 1,
  },
});