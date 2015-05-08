var AppDispatcher = require('../Dispatcher/RealPolishAppDispatcher');
var AppConstants = require('../Constants/RealConstants');

var ActionTypes = AppConstants.ActionTypes;

module.exports = {

  receiveLessons: function(remoteLessons) {
    AppDispatcher.dispatch({
      type: ActionTypes.RECEIVE_REMOTE_LESSONS,
      remoteLessons: remoteLessons
    });
  }

};
