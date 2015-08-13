// jshint devel:true
(function(){
  console.log('initiated');
  // AJAX crawling
  function callAjax(url, callback, params) {
      var xmlhttp;
      xmlhttp = new XMLHttpRequest();
      xmlhttp.onreadystatechange = function() {
          if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
              callback(xmlhttp.responseText, params);
          }
      };
      xmlhttp.open("GET", url, true);
      xmlhttp.send();
  }
  function processMeetingData(jsonData) {
    console.log(jsonData);
    jsonData = JSON.parse(jsonData);
    showMeetings(jsonData[0]);
  }
  function showMeetings(date) {
    console.log("start time is ", date);
    var currDate = new Date(date.startTime);
    console.log("current date is ", currDate);
  }
  callAjax("data/sample-data.json", processMeetingData);
})();
