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
  imageContainer: {
    width: 75,
    height: 75,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red'
  },
  textContainer: {
    alignSelf: 'center',
    marginLeft: 14,
  },
  title: {
    fontSize: 16,
    fontFamily: 'HelveticaNeue',
    fontWeight: '400',
    color: 'black',
  },
  subtitle: {
    fontSize: 12,
    fontFamily: 'HelveticaNeue',
    fontWeight: '200',
    color: 'black',
  },
});