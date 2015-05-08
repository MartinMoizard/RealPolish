var API_URL = "http://realpolish-martinmoizard.rhcloud.com";
var LESSONS_PATH = "/lessons";

module.exports = {
  getLessons: function(onSuccess, onError) {
    var lessonsRemoteUrl = API_URL + LESSONS_PATH;
    fetch(lessonsRemoteUrl)
      .then(response => response.json())
      .then(json => onSuccess(json))
      .catch(error => onError(error))
  }
};