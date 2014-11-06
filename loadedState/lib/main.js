//Firefox Addon created by Bruno Vegreville and Come Weber | Last Update : November 2014 . Contact at bruno.vegreville@gmail.com .
//Once Firefox launched, the loadedState addon write in the file 'resultat.txt' every following  state that an firefox tab can have : -open , -loaded , -activated, -deactivated, -closed. Only the last state is written.

var tabs = require("sdk/tabs");
var data = require("sdk/self").data;
var { ActionButton } = require('sdk/ui/button/action');


var filehandler = require("./filehandler.js");

var button = ActionButton({  //Button that let the user change the path of the track file.
  id: "loadedState",
  label: "Change the path of your track file.",
  icon: "./loadedState.ico",
  onClick: function(state) {
      filehandler.filePick();
  }
});

function onOpen(tab) {  
  filehandler.fileWrite(tab.url + " is open.");
  tab.on("pageshow", logShow);
  tab.on("activate", logActivate);
  tab.on("deactivate", logDeactivate);
  tab.on("close", logClose);
  
}


function logShow(tab) { 
   filehandler.fileWrite(tab.url + " is loaded.");
}

function logActivate(tab) {  
  filehandler.fileWrite(tab.url + " is activated.");
}

function logDeactivate(tab) {  
  filehandler.fileWrite(tab.url + " is deactivated.");
}

function logClose(tab) {  
  filehandler.fileWrite(tab.url + " is closed.");
}



tabs.on('open', onOpen);
onOpen(tabs[0]); // So that the first tab is also tracked.
