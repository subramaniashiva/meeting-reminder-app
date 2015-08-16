// jshint devel:true
(function(){
  console.log('initiated');
  // Function to add 'n' number of days to the dateObj
  function addDays(dateObj, n) {
    var time = dateObj.getTime();
    var changedDate = new Date(time + (n * 24 * 60 * 60 * 1000));
    return changedDate;
  }
  // Function to remove the elements by class name
  // Used to remove the meeting details when navigating from one date to another
  function removeElementsByClass(className, parent){
    var parent = parent || document;
    var elements = parent.getElementsByClassName(className);
    while(elements.length > 0){
        elements[0].parentNode.removeChild(elements[0]);
    }
  }
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
  // This is the core function which parses the JSON data
  // and filters out the meetings for the date passed
  // and finds out if there are any overlapping meetings
  // and adjusts the CSS accordingly
  // Finally it attaches the meeting details to DOM
  function processMeetingData(jsonData, date) {
    // Variable for finding the current date's meetings
    var date1, date2, todayMeetings, dElemList, tempStartTime, tempEndTime, 
    template, startMins, endMins, dDetails, meetingDuration;
    // Dom variables
    var dCurrDate, dParentContainer;
    // Variables for funding overlapping meetings
    var sourceStartTime, sourceEndTime, overlappingEvents, compareStartTime,
    compareEndTime, widthValue, leftValue;
    // Iterator variables
    var i, j,k;
    // Parsing the JSON data
    jsonData = JSON.parse(jsonData);
    date = date || (new Date());
    date2 = (new Date(date)).toLocaleDateString();
    // Using filter function to list out the meetings for the date passed
    todayMeetings = jsonData.filter(function(currentValue) {
      // Convert the start and end time into local time
      date1 = (new Date(currentValue.startTime)).toLocaleString();
      if(date1.split(',')[0] === date2) {
        currentValue.startTime = date1;
        currentValue.endTime = (new Date(currentValue.endTime)).toLocaleString();
        return currentValue;
      }
    });
    // Update the current date in UI
    dCurrDate = document.getElementById('current-date');
    dCurrDate.innerHTML = date.toDateString();
    // Remove all the meeting details for the previous date
    dParentContainer = document.getElementById('meeting-container');
    removeElementsByClass('details', dParentContainer);
    dElemList = document.getElementsByClassName('meeting-info');

    // Find out whether two meetings overlap
    for(i =0; i < todayMeetings.length; i++) {
      sourceStartTime = new Date(todayMeetings[i].startTime);
      sourceEndTime = new Date(todayMeetings[i].endTime);
      overlappingEvents = [];
      for(j = i+1; j < todayMeetings.length; j++) {
        compareStartTime = new Date(todayMeetings[j].startTime);
        compareEndTime = new Date(todayMeetings[j].endTime);
        if((sourceStartTime === compareStartTime) || 
          (sourceStartTime < compareStartTime && sourceEndTime > compareStartTime)
          || (sourceStartTime < compareEndTime && sourceEndTime > compareEndTime)
          || (sourceStartTime > compareStartTime && sourceStartTime < compareEndTime)) {
          if(todayMeetings[i].overlapCount) {
            todayMeetings[i].overlapCount++;
          } else {
            todayMeetings[i].overlapCount = 1;
          }
          if(todayMeetings[j].overlapCount) {
            todayMeetings[j].overlapCount++;
          } else {
            todayMeetings[j].overlapCount = 1;
          }
          overlappingEvents.push(todayMeetings[j]);
        } 
      }
      // If more that one meeting overlap at given time, they must be placed
      // next to each other. So the CSS left value will increase
      for(k = 0; k < overlappingEvents.length; k++) {
          if(!overlappingEvents[k].pushNext) {
            overlappingEvents[k].pushNext = (100/(overlappingEvents.length+1))*(k+1);
          }
      }
    }
    // This loop will take the today's meetings and apply the details to the
    // template and push it to DOM
    for(i = 0; i < todayMeetings.length; i++) {
      tempStartTime = new Date(todayMeetings[i].startTime);
      tempEndTime = new Date(todayMeetings[i].endTime);
      template = (document.getElementById('meeting-template')).innerHTML;
      template = template.replace('{{title}}', todayMeetings[i].title);
      template = template.replace('{{startTime}}', todayMeetings[i].startTime.split(',')[1]);
      template = template.replace('{{endTime}}', todayMeetings[i].endTime.split(',')[1]);
      // Assigning top value
      startMins = tempStartTime.getMinutes();
      startMins = parseInt(startMins, 10);
      template = template.replace('{{topValue}}', ((startMins/60)*100).toString()+'%');
      // Assigning height based on meeting duration
      meetingDuration = tempEndTime.getTime() - tempStartTime.getTime();
      meetingDuration = (meetingDuration/60000);
      template = template.replace('{{heightValue}}', ((meetingDuration/60)*100).toString()+'%');
      // If more than one meeting overlaps, change the width and left value
      widthValue = 100;
      leftValue = 0;
      if(todayMeetings[i].overlapCount) {
        widthValue = (100/(todayMeetings[i].overlapCount+1)).toString();
      }
      template = template.replace('{{widthValue}}', widthValue+'%');

      if(todayMeetings[i].pushNext) {
        leftValue = (todayMeetings[i].pushNext).toString();
      }
      template = template.replace('{{leftValue}}', leftValue+'%');
      // Push the template to DOM
      dElemList[tempStartTime.getHours()].innerHTML += template;
    }
  }
  var dPrev = document.getElementById("prev"),
      dNext = document.getElementById("next"),
      dToday = document.getElementById("today");
  dPrev.addEventListener("click", function() {
    currentDate = addDays(currentDate, -1);
    callAjax("data/sample-data.json", processMeetingData, currentDate);
  });
  dNext.addEventListener("click", function() {
    currentDate = addDays(currentDate, 1);
    callAjax("data/sample-data.json", processMeetingData, currentDate);
  });
  dToday.addEventListener("click", function() {
    currentDate = new Date();
    callAjax("data/sample-data.json", processMeetingData, currentDate);
  });
  // Get the current date
  var currentDate = new Date();
  // Get the details for the current date
  callAjax("data/sample-data.json", processMeetingData, currentDate);
})();
