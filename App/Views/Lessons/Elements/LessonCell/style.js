'use strict';

var React = require('react-native');

var {
  StyleSheet,
} = React;

module.exports = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderColor: '#EDE6E7'
  },

  numberContainer: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  textContainer: {
    alignSelf: 'center',
    marginLeft: 14,
  },

  number: {
    color: 'white',
    fontSize: 18,
    fontWeight: '500',
  },
  
  title: {
    fontSize: 16,
    fontFamily: 'HelveticaNeue',
    fontWeight: '300',
    color: 'black',
  },

});