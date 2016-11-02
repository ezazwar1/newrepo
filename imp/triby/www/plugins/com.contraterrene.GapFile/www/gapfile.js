cordova.define("com.contraterrene.GapFile.GapFile", function(require, exports, module) { /* 
* File system wrappers for Phonegap/Apache Cordova
* by Anthony W. Hursh, tony.hursh@gmail.com
* Copyright 2013 by Contraterrene eLearning Group, LLC
* Made available under the terms of the Apache 2.0 license
* (the same license as Phonegap/Cordova itself). See the NOTICE
* file for details.
*/
var GapFile = {
		extractDirectory: function(path){
		var dirPath;
		var lastSlash = path.lastIndexOf('/');
		if(lastSlash == -1){
			dirPath = "/";
		}
		else{
			dirPath = path.substring(0,lastSlash);
			if(dirPath == ""){
				dirPath = "/";
			}
		}
		return dirPath;
	},

	extractFilename: function(path){
		var lastSlash = path.lastIndexOf('/');
		if(lastSlash == -1){
			return path;
		}
		var filename =  path.substring(lastSlash + 1);
		return filename;
	},

	appendFile: function(fullpath,data,success,fail){
		this.llWriteFile(fullpath,data,success,fail,true);
	},
	
	writeFile: function(fullpath,data,success,fail){
		this.llWriteFile(fullpath,data,success,fail,false);
	},
	
	llWriteFile: function(fullpath,data,success,fail,append){
		window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, 
			function(fileSystem){
				fileSystem.root.getDirectory(GapFile.extractDirectory(fullpath), {create: true, exclusive: false},
				function(dirEntry){
					dirEntry.getFile(GapFile.extractFilename(fullpath), {create: true}, 
					function(fileEntry){
							var fileURL = fileEntry.toURL();
							fileEntry.createWriter(
								function(writer){
									writer.onwrite = function(evt){
										success(fileURL);
									};
									writer.onerror = function(evt){ 
										fail(evt.target.error);
									};
									if(append == true){
										writer.seek(writer.length);
									}
									writer.write(data);
							},fail);
					},fail);
				},fail);
			},fail);
	},
	readFile: function(fullpath,asText,success,fail){
		window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, 
			function(fileSystem){
				fileSystem.root.getDirectory(GapFile.extractDirectory(fullpath), {create: false, exclusive: false},
				function(dirEntry){
					dirEntry.getFile(GapFile.extractFilename(fullpath), {create: false}, 
					function(fileEntry){
						fileEntry.file(function(file){
							var reader = new FileReader();
							reader.onloadend = function(evt) {
								success(evt.target.result);
							};
							reader.onerror =  function(evt){
								fail();
							}
							if(asText){
								reader.readAsText(file);
							}
							else{
								reader.readAsDataURL(file);
							}
							},fail);
						},fail);
					},fail);
				},fail);
	},
	
	deleteFile: function(fullpath,success,fail){
			window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, 
				function(fileSystem){
					fileSystem.root.getDirectory(GapFile.extractDirectory(fullpath), {create: false, exclusive: false},
					function(dirEntry){
						dirEntry.getFile(GapFile.extractFilename(fullpath), {create: false}, 
						function(fileEntry){
							fileEntry.remove(success,fail);
						},fail);
					},fail);
				},fail);
	},
	readDirectory: function(dirName,success,fail){
		window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, 
			function(fileSystem){
				fileSystem.root.getDirectory(dirName, {create: false, exclusive: false},
					function(dirEntry){
						var directoryReader = dirEntry.createReader();
						directoryReader.readEntries(
							function(entries){
								var flist = [];
								for(var i = 0; i < entries.length; i++){
									flist.push(entries[i].name);
								}
								success(flist);
							},fail);
					},fail);
			},fail);       
	},
	
	
	mkDirectory: function(dirName,success,fail){
		window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, 
			function(fileSystem){
		        fileSystem.root.getDirectory(dirName, {create: true, exclusive: false}, success, fail);
			},fail);
	},
	
	rmDirectory: function(dirName,success,fail){
		window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, 
			function(fileSystem){
		        fileSystem.root.getDirectory(dirName, {create: false, exclusive: false}, 
						function(dirEntry){
							dirEntry.remove(success,fail);
						},fail);
				},fail)
	},

	fileExists: function(fullpath,success,fail){
		var dirName = this.extractDirectory(fullpath);
		var fileName = this.extractFilename(fullpath);
		this.readDirectory(dirName,function(flist){
			for(var i = 0; i < flist.length; i++ ){
				if(flist[i].match(fileName)){
					success(true);
					return;
				}
			}
			success(false);
		},fail); 
	}
};

if(module){
	module.exports = GapFile;
}


});
