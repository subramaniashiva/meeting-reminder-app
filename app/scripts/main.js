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
      xmlhttp.open('GET', url, true);
      xmlhttp.send();
  }

  function removeElementsByClass(className, parent){
    var parent = parent || document;
    var elements = parent.getElementsByClassName(className);
    while(elements.length > 0){
        elements[0].parentNode.removeChild(elements[0]);
    }
  }
  function processMeetingData(jsonData, date) {
    var date1, date2, todayMeetings, dElemList, tempStartTime, tempEndTime, i, template, startMins, endMins,
    dDetails, meetingDuration;
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
    var dCurrDate = document.getElementById('current-date');
    dCurrDate.innerHTML = date.toDateString();
    var dParentContainer = document.getElementById('meeting-container');
    removeElementsByClass('details', dParentContainer);
    dElemList = document.getElementsByClassName('meeting-info');
    console.log('total number of meetings today ', todayMeetings.length);
    for(i = 0; i < todayMeetings.length; i++) {
      tempStartTime = new Date(todayMeetings[i].startTime);
      tempEndTime = new Date(todayMeetings[i].endTime);
      template = (document.getElementById('meeting-template')).innerHTML;
      template = template.replace('{{title}}', todayMeetings[i].title);
      template = template.replace('{{startTime}}', todayMeetings[i].startTime.split(',')[1]);
      template = template.replace('{{endTime}}', todayMeetings[i].endTime.split(',')[1]);

      startMins = tempStartTime.getMinutes();
      startMins = parseInt(startMins, 10);
      template = template.replace('{{topValue}}', ((startMins/60)*100).toString()+'%');

      meetingDuration = tempEndTime.getTime() - tempStartTime.getTime();
      meetingDuration = (meetingDuration/60000);

      template = template.replace('{{heightValue}}', ((meetingDuration/60)*100).toString()+'%');

      dElemList[tempStartTime.getHours()].innerHTML += template;
      
      

      
      console.log('meeting duration of '+ todayMeetings[i].title, meetingDuration);

    }
  }
  function showMeetings(date) {
    var currDate = new Date(date.startTime);
    console.log("current date is ", currDate);
  }
  var dPrev = document.getElementById("prev"),
      dNext = document.getElementById("next"),
      dToday = document.getElementById("today");
  dPrev.addEventListener("click", function() {
    currentDate = currentDate.addDays(-1);
    callAjax("data/sample-data.json", processMeetingData, currentDate);
  });
  dNext.addEventListener("click", function() {
    currentDate = currentDate.addDays(1);
    callAjax("data/sample-data.json", processMeetingData, currentDate);
  });
  dToday.addEventListener("click", function() {
    currentDate = new Date();
    callAjax("data/sample-data.json", processMeetingData, currentDate);
  });
  var currentDate = new Date();
  callAjax("data/sample-data.json", processMeetingData, currentDate);
})();
