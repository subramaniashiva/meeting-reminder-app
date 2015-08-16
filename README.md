# Meeting Reminder App
An app that manages your meetings and appointments. This is a demo app which reads the meetings and appointments from a JSON and displays in calendar format. You can view the app live here

Clone the repo and do the following comments

    npm install && bower install
   
Once all the dependencies are installed, run the following command
  

    grunt serve

### Tools used:

 - Yeoman Web App Generator - For scaffolding the app 
 - Grunt - For managing the tasks such as compiling, minification, etc
 - Bower - For managing the dependencies

 
### External Libraries used: 
Regarding JavaScript, no external libraries are used. I have written this in vanilla JavaScript. (Modernizer is used for better browser support). 

SASS is used for managing CSS. Bootstrap CSS is used for making this a responsive app. (This has not been tested in all screen sizes. Pending as future improvement)

Data is read from *sample-data.json* file using AJAX. This can easily be converted into a REST endpoint in future.

### Future improvements

 - Better logic for meeting overflowing into next day. 
 - Better positioning for Edit/Cancel/Delete buttons
 - Improved look and feel
 - Making the app responsive
 - Edit/Cancel/Delete functionality