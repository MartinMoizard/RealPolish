'use strict';

var React = require('react-native');

var {
  StyleSheet,
} = React;

module.exports = StyleSheet.create({

  container: {
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderColor: '#EDE6E7'
  },

  title: {
    marginTop: 6,
    fontSize: 12,
    fontFamily: 'HelveticaNeue',
    fontWeight: '200',
    textAlign: 'center',
  },

  progressContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'nowrap',
    alignItems: 'center',
    marginBottom: 7,
  },

  time: {
    width: 37,
    marginLeft: 8,
    fontSize: 10,
    fontFamily: 'HelveticaNeue',
    fontWeight: '300',
  },

  slider: {
    flex: 1,
    height: 10,
  },

  playPause: {
    width: 28,
    height: 28,
    marginRight: 7,
    marginLeft: 7,
  },

});