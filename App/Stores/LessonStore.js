var _ = require('underscore');
var assign = require('object-assign');
var React = require('react-native');
var EventEmitter = require('events').EventEmitter;

var AppDispatcher = require('../Dispatcher/RealPolishAppDispatcher');
var ActionTypes = require('../Constants/RealConstants').ActionTypes;
var LessonsManager = require('NativeModules').RPLessonsManager;

var CHANGE_EVENT = 'change';
var DOWNLOAD_STATE_CHANGED_EVENT = "DownloadStateChanged";

var _lessons = [];

var {
  DeviceEventEmitter
} = React;

var LessonStore = assign({}, EventEmitter.prototype, {
	refresh: function(remoteLessons) {
		_lessons = remoteLessons;
		LessonsManager.refreshLessonsWith(remoteLessons);
  },

	emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  getCached: function(callback) {
    LessonsManager.cachedLessons((error, result) => {
      var cachedLessons = error ? [] : result;
      callback(cachedLessons);
    });
  },

  getAll: function() {
    return _lessons;
  },

  isDownloaded: function(lesson, callback) {
    LessonsManager.isDownloaded(lesson, (error, result) => {
      callback(result);
    });
  },

  isDownloading: function(lesson, callback) {
    LessonsManager.isDownloading(lesson, (error, downloadingCurrLess, downloadingOtherLesson) => {
      callback(downloadingCurrLess, downloadingOtherLesson);
    });
  },

  download: function(lesson) {
    LessonsManager.downloadLesson(lesson);
  },

});

LessonStore.dispatchToken = AppDispatcher.register(function(action) {
  switch(action.type) {
    case ActionTypes.RECEIVE_REMOTE_LESSONS:
      LessonStore.refresh(action.remoteLessons);
      LessonStore.emitChange();
      break;

    default:
      // do nothing
  }
});

DeviceEventEmitter.addListener(
  DOWNLOAD_STATE_CHANGED_EVENT,
  (notification) => {
    LessonStore.emitChange();
  }
);

module.exports = LessonStore;