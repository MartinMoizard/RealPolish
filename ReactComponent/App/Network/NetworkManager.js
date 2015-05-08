var API_URL = "http://realpolish-martinmoizard.rhcloud.com";
var LESSONS_PATH = "/lessons";

module.exports = {
  getLessons: function(onSuccess, onError) {
    var lessonsRemoteUrl = API_URL + LESSONS_PATH;
    fetch(lessonsRemoteUrl)
      .then(function(response) {
        return response.json();
      }).then(function(json) {
        onSuccess(json);
      }).catch(function(exc) {
        onError(exc);
      });
  }
};