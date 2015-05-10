'use strict';

var React = require('react-native');

var {
  Text,
  View,
  TouchableHighlight,
  Image,
} = React;

var styles = require("./style");

var ItemCell = React.createClass({
  render: function() {
    return (
      <TouchableHighlight onPress={this.props.onSelect}>
      <View style={styles.container}>
        <View style={[styles.imageContainer, {
          backgroundColor: this.props.itemInfo.color
        }]}>
          <Image
            source={this.props.itemInfo.img}/>
          
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>
            {this.props.itemInfo.title}
          </Text>
          <Text style={styles.subtitle}>
            {this.props.itemInfo.subtitle}
          </Text>
        </View>
      </View>
      </TouchableHighlight>
    );
  }
});

module.exports = ItemCell;