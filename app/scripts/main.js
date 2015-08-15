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
  function processMeetingData(jsonData, date) {
    var date1, date2, todayMeetings, elemList, tempStartTime, i;
    jsonData = JSON.parse(jsonData);
    date = date || (new Date());
    date2 = (new Date(date)).toLocaleDateString();
    todayMeetings = jsonData.filter(function(currentValue) {
      date1 = (new Date(currentValue.startTime)).toLocaleString();
      if(date1.split(',')[0] === date2) {
        currentValue.startTime = date1;
        currentValue.endTime = (new Date(currentValue.endTime)).toLocaleString();
        return currentValue;
      }
    });
    elemList = document.getElementsByClassName('meeting-info');
    for(i = 0; i < todayMeetings.length; i++) {
      tempStartTime = new Date(todayMeetings[i].startTime);
      elemList[tempStartTime.getHours()].innerHTML = "Meeting is there";
    }
  }
  function showMeetings(date) {
    console.log("start time is ", date);
    var currDate = new Date(date.startTime);
    console.log("current date is ", currDate);
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
  var date = new Date();
  callAjax("data/sample-data.json", processMeetingData, date);
})();
