'use strict';

var React = require('react-native');

var {
  Text,
  View,
  TouchableHighlight
} = React;

var styles = require("./style");
var LessonStore = require('../../../../Stores/LessonStore');

var colors = ['#F4CD6A', '#49BEBE', '#D56F94', '#7D4D85', '#F5B280', '#5B78A1'];

var LessonCell = React.createClass({
  getInitialState: function() {
    return {
      opacity: 0.3,
    };
  },

  refreshStateFromStore: function() {
    LessonStore.isDownloaded(this.props.lesson, result => {
      if (result === true) {
        this.setState({
          opacity: 1.0,
          titleColor: 'black'
        });
      } else {
        this.setState({
          opacity: 0.3,
          titleColor: 'gray'
        });
      }
    });
  },

  render: function() {
    var color = colors[(this.props.lesson.id - 1) % colors.length];
    return (
      <TouchableHighlight onPress={this.props.onSelect}>
      <View style={styles.container}>
        <View style={[styles.numberContainer, {backgroundColor: color, opacity: this.state.opacity}]}>
          <Text style={styles.number}>
            {this.props.lesson.id}
          </Text>
        </View>
        <View style={styles.textContainer}>
            <Text style={[styles.title, {color: this.state.titleColor}]}>
              {this.props.lesson.title}
            </Text>
          </View>
      </View>
      </TouchableHighlight>
    );
  },

  componentDidMount: function() {
    LessonStore.addChangeListener(this._onChange);
    this.refreshStateFromStore();
  },

  componentWillUnmount: function() {
    LessonStore.removeChangeListener(this._onChange);
  },

  _onChange: function() {
    this.refreshStateFromStore();
  },

});

module.exports = LessonCell;