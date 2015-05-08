var AppDispatcher = require('../dispatcher/RealPolishAppDispatcher');
var ActionTypes = require('../Constrants/RealConstants.js');

var _lessons = [];

var LessonStore = assign({}, EventEmitter.prototype, {
	refresh: function(remoteLessons) {
		_lessons = remoteLessons;
  },

	emitChange: function() {
    this.emit("");
  },
});

LessonStore.dispatchToken = AppDispatcher.register(function(action) {
  switch(action.type) {
    case ActionTypes.RECEIVE_REMOTE_LESSONS:
      ThreadStore.refresh(action.remoteLessons);
      ThreadStore.emitChange();
      break;

    default:
      // do nothing
  }
});

module.exports = LessonStore;