'use strict';

var React = require('react-native');

var {
  Text,
  View,
  TouchableOpacity,
  Image,
  SliderIOS,
  DeviceEventEmitter,
} = React;

var AudioPlayer = require('NativeModules').RPAudioPlayerManager;
var styles = require("./style");

function timeToString(time) {
  if (time == null) {
    return '--:--';
  } else {
    return 'todo';
  }
}

var PlayerView = React.createClass({
  getInitialState: function() {
    return {
      playing: false,
      currentTime: null,
      playStateChangedSubscription: null,
    };
  },

  refreshState: function() {
    var self = this;
    AudioPlayer.isPlaying((error, res) => {
      self.setState({
        playing: res,
        currentTime: this.state.currentTime,
        playStateChangedSubscription: this.state.playStateChangedSubscription
      });
    });
  },

  render: function() {
    var playImage = this.state.playing ? require('image!pause') : require('image!play');
    var currentTime = timeToString(this.state.currentTime);
    return (
      <View style={styles.container} >
        <View style={styles.progressContainer} >
          <Text style={styles.time}>
            {currentTime}
          </Text>
          <SliderIOS style={styles.slider} minimumTrackTintColor='#49BEBD' />
          <TouchableOpacity onPress={this.onPlayPause}>
            <Image style={styles.playPause} source={playImage} />
          </TouchableOpacity>
        </View>
      </View>
    );
  },

  onPlayPause: function() {
    AudioPlayer.togglePlayPause();
  },

  componentDidMount: function() {
    var self = this;
    var subscription = DeviceEventEmitter.addListener(
      'playStateChanged',
      (notification) => {
        self.refreshState();
      }
    );
    this.setState({
      playing: this.state.playing,
      currentTime: this.state.currentTime,
      playStateChangedSubscription: subscription,
    });
  },

  componentWillUnmount: function() {
    var subscription = this.state.playStateChangedSubscription;
    if (subscription) {
      subscription.remove();
    }
  },
});

module.exports = PlayerView;