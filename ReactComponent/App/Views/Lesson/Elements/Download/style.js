'use strict';

var React = require('react-native');

var {
  StyleSheet,
} = React;

module.exports = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  button: {
    marginTop: 10,
    width: 180,
    height: 31,
    backgroundColor: '#49BEBD',
    justifyContent: 'center',
    alignItems: 'center',
  },

  image: {
    marginTop: 40,
    width: 123,
    height: 112
  },

  text: {
    fontSize: 14,
    fontFamily: 'HelveticaNeue',
    fontWeight: '200',
    color: 'white',
  },

  inprogress: {
    marginTop: 10,
    fontSize: 14,
    fontFamily: 'HelveticaNeue',
    fontWeight: '200',
    color: 'black',
  }
});