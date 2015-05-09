var AppDispatcher = require('../Dispatcher/RealPolishAppDispatcher');
var ActionTypes = require('../Constants/RealConstants').ActionTypes;
var EventEmitter = require('events').EventEmitter;
var LessonsManager = require('NativeModules').RPLessonsManager;
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var _lessons = [];

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

  getAll: function() {
    return _lessons;
  },

  isDownloaded: function(lesson) {
    return false;
  },

  download: function(lesson) {
    LessonsManager.downloadStoryOfLesson(lesson, (error, nic) => {
    });
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

module.exports = LessonStore;