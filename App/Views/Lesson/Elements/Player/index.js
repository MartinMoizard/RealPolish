'use strict';

var React = require('react-native');

var {
  Text,
  View,
  TouchableOpacity,
  Image,
  SliderIOS,
} = React;

var styles = require("./style");

var PlayerView = React.createClass({
  render: function() {
    return (
      <View style={styles.container} >
        <Text style={styles.title} >
          Story
        </Text>
        <View style={styles.progressContainer} >
          <Text style={styles.time}>
            12:05
          </Text>
          <SliderIOS style={styles.slider} minimumTrackTintColor='#49BEBD' />
          <TouchableOpacity onPress={this.onPlayPause}>
            <Image style={styles.playPause} source={require('image!play')} />
          </TouchableOpacity>
        </View>
      </View>
    );
  },

  onPlayPause: function() {

  },
});

module.exports = PlayerView;