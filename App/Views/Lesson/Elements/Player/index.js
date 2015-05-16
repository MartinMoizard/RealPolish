'use strict';

var React = require('react-native');
var _ = require("underscore");
var moment = require("moment");

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
  if (time === 0) {
    return '--:--';
  } else {
    var d = new Date(0, 0, 0, 0, 0, time, 0);
    return moment(d).format("mm:ss");
  }
}

var PlayerView = React.createClass({
  getInitialState: function() {
    return {
      playing: false,
      currentTime: 0,
      subscriptions: [],
    };
  },

  refreshPlayingState: function() {
    var self = this;
    AudioPlayer.isPlaying((error, res) => {
      var newState = _.extend({}, this.state);
      newState.playing = res;
      self.setState(newState);
    });
  },

  refreshCurrentTime: function(time) {
    var newState = _.extend({}, this.state);
    newState.currentTime = time;
    this.setState(newState);
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
    var playStateSubscription = DeviceEventEmitter.addListener(
      'playStateChanged',
      (notification) => {
        self.refreshPlayingState();
      }
    );
    
    var progressSubscription = DeviceEventEmitter.addListener(
      'playProgressChanged',
      (notification) => {
        self.refreshCurrentTime(notification.currentTime);
      }
    );

    var newState = _.extend({}, this.state);
    newState.subscriptions = [playStateSubscription, progressSubscription];
    this.setState(newState);
  },

  componentWillUnmount: function() {
    _.each(this.state.subscriptions, subscription => {
      subscription.remove();
    });
  },
});

module.exports = PlayerView;