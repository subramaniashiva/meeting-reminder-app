// jshint devel:true
(function(){
  console.log('initiated');
  Date.prototype.addDays = function (n) {
    var time = this.getTime();
    var changedDate = new Date(time + (n * 24 * 60 * 60 * 1000));
    this.setTime(changedDate.getTime());
    return this;
  };
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
  function showMeetingsForDate(dateString) {
    console.log("The date passed is ", dateString);
  }
  var prev = document.getElementById("prev"),
      next = document.getElementById("next"),
      today = document.getElementById("today");
  prev.addEventListener("click", function() {
    var date = new Date();
    date = date.addDays(-1);
    showMeetingsForDate(date.toString());
  });
  next.addEventListener("click", function() {
    var date = new Date();
    date = date.addDays(1);
    showMeetingsForDate(date.toString());
  });
  today.addEventListener("click", function() {
    var date = new Date();
    showMeetingsForDate(date.toString());
  });
  callAjax("data/sample-data.json", processMeetingData);
})();
