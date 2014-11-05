//Firefox Addon created by Bruno Vegreville and Come Weber | Last Update : November 2014 . Contact at bruno.vegreville@gmail.com .
//Once Firefox launched, the loadedState addon write in the file 'resultat.txt' every following  state that an firefox tab can have : -open , -loaded , -activated, -deactivated, -closed. Only the last state is written.


const {Cc,Ci,Cu} = require("chrome"); 
var tabs = require("sdk/tabs");
Cu.import("resource://gre/modules/FileUtils.jsm");

function writeState(state){
	//create proper path for file
	var theFile = '/home/bruno/Bureau/AddonFirefox/loadedState/data/resultat.txt';
	//create component for file writing
	var file = new FileUtils.File(theFile);
	var foStream = Cc["@mozilla.org/network/file-output-stream;1"].createInstance(Ci.nsIFileOutputStream);
	// use 0x02 | 0x10 to open file for appending.
	//foStream.init(file, 0x02 | 0x10, 0666, 0);
	foStream.init(file, 0x02 | 0x08 | 0x20, 0666, 0); 

	// if you are sure there will never ever be any non-ascii text in data you can
	// also call foStream.write(data, data.length) directly
	var converter = Cc["@mozilla.org/intl/converter-output-stream;1"].createInstance(Ci.nsIConverterOutputStream);
	converter.init(foStream,"UTF-8", 0, 0);
	converter.writeString(state);
	converter.close(); // this closes foStream
}
function onOpen(tab) {  
  writeState(tab.url + " is open.");
  tab.on("pageshow", logShow);
  tab.on("activate", logActivate);
  tab.on("deactivate", logDeactivate);
  tab.on("close", logClose);
  
}


function logShow(tab) { 
   writeState(tab.url +" is loaded.");
}

function logActivate(tab) {  
  writeState(tab.url + " is activated.");
}

function logDeactivate(tab) {  
  writeState(tab.url + " is deactivated");
}

function logClose(tab) {  
  writeState(tab.url + " is closed");
}



tabs.on('open', onOpen);
onOpen(tabs[0]); // So that the first tab is also tracked.
