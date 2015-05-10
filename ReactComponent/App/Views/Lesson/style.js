'use strict';

var React = require('react-native');

var {
  StyleSheet,
} = React;

module.exports = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },

  text: {
    fontSize: 25,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 10,
    marginRight: 10,
    color: 'black',
  },

  header: {
    backgroundColor: '#E57468',
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

  headerContent: {
    justifyContent: 'center',
    alignItems: 'center'
  },

  lessonImage: {
    marginTop: 22,
    height: 90,
    width: 90,
  },

  lessonTitle: {
    marginTop: 18,
    height: 17,
    fontSize: 14,
    fontFamily: 'HelveticaNeue',
    fontWeight: '500',
    color: 'white',
  },

  lessonSubtitle: {
    marginTop: 2,
    marginBottom: 19,
    height: 17,
    fontSize: 11,
    fontFamily: 'HelveticaNeue',
    fontWeight: '300',
    color: 'white',
  },

  itemsList: {
    backgroundColor: 'white'
  }
});