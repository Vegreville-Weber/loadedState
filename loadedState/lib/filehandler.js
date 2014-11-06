const { pathFor } = require('sdk/system');
const path = require('sdk/fs/path');
const file = require('sdk/io/file');
const {Cc,Ci,Cu} = require("chrome"); 
Cu.import("resource://gre/modules/FileUtils.jsm");



function filePick(){ //Show a file picker so that the user is able to choose a path for his track file.
  const nsIFilePicker = Ci.nsIFilePicker;

  var fp = Cc["@mozilla.org/filepicker;1"]
           .createInstance(nsIFilePicker);

  var window = require("sdk/window/utils").getMostRecentBrowserWindow();
  fp.init(window, "Select a file", nsIFilePicker.modeOpen);
  fp.appendFilters(nsIFilePicker.filterAll | nsIFilePicker.filterText);

  var rv = fp.show();
  if (rv == nsIFilePicker.returnOK || rv == nsIFilePicker.returnReplace) {
    var file = fp.file;
    // Get the path as string. Note that you usually won't
    // need to work with the string paths.
    var path = fp.file.path;
    // work with returned nsILocalFile...
  }
  saveFilePath(path);
}

function fileWrite(state){ //write state in the track file.
	while(readFilePath() == null){  //User never set a path to the track file
		filePick();		
	}
	var filePath = readFilePath();
	//create component for file writing
	var file = new FileUtils.File(filePath);
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


function saveFilePath(str){ //change the path of the track file.
  var filename = path.join(pathFor('ProfD'), 'loadedStatePath.txt');
  var textWriter = file.open(filename, 'w');
  textWriter.write(str);
  textWriter.close();
}

function readFilePath(){ //returns the path of the track file. this information is stocked in a file located in the mozilla user profil directory.
  var filename = path.join(pathFor('ProfD'), 'loadedStatePath.txt');
  if(!file.exists(filename)){
    return null;
  }
  var textReader = file.open(filename, 'r');
  var str = textReader.read();
  textReader.close();
  return str;
}


exports.filePick = filePick;
exports.fileWrite = fileWrite;

