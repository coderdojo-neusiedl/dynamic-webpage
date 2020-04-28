var fs = require('fs');


// unwanted prefix = Byte Order Mark (BOM) = ef bb bf
var removeByteOrderMark = function removeByteOrderMark(text) {
   return text.replace(/^\uFEFF/, '');
};


var getStatusOf = function getStatusOf(path) {

   var exists = false;
   var isDirectory = false;
   
   try {
      
      var fileDescriptor = fs.openSync(path, 'r');
      var stat = fs.fstatSync(fileDescriptor);
      fs.closeSync(fileDescriptor);
      exists = true;
      isDirectory = stat.isDirectory();
      
   } catch(e) {}
   
   return { exists: exists, isDirectory: isDirectory };
};


var getParentFolderOf = function getParentFolderOf(path) {

   var hasTrailingSlash = path.lastIndexOf('/') === path.length - 1;
   var indexOfColon = path.indexOf(':');
   
   var drive = path.substr(0, indexOfColon + 1);
   var numberOfCharacters = path.length - drive.length - (hasTrailingSlash ? 1 : 0);
   
   var normalizedPath = path.substr(drive.length, numberOfCharacters);
    
   var indexOfLastSlash = normalizedPath.lastIndexOf('/');
   
   return drive + ((indexOfLastSlash === -1) ? '' : normalizedPath.substr(0, indexOfLastSlash));
};


var createFolder = function createFolder(path) {
   fs.mkdirSync(path);
};


var processFolder = function processFolder(path, actionWhenPathDoesNotExist) {
   
   var pathStatus = getStatusOf(path);
   
   if (pathStatus.exists === false) {
   
      actionWhenPathDoesNotExist(path);
   
   } else {
   
      if (pathStatus.isDirectory === false) {
      
         throw new Error('"' + path + '" already exists and is not a directory!');
      }
   }
};


var when = function when(path) {

   return   { 
               doesNotExistThenCall: function doesNotExistThenCall(action) {

                  processFolder(path, action);
               }
            };
};


var Constructor = function Constructor() {

   this.mkdirWithParents = function mkdirWithParents(path) {
      
      var parentFolder = getParentFolderOf(path);
      var rootReached = parentFolder.indexOf('/') === -1;
      
      if (rootReached) {
      
         createFolder(path);
         
      } else {
      
         when(parentFolder).doesNotExistThenCall(mkdirWithParents);
         when(path).doesNotExistThenCall(createFolder);
      }
   };
   
   
   this.copyFile = function copyFile(sourcePath, targetPath, actionOnFinish) {
     
      var inputStream = fs.createReadStream(sourcePath);
      var outputStream = fs.createWriteStream(targetPath);
      
      outputStream.on('finish', function() {
         actionOnFinish();
      });
      
      inputStream.pipe(outputStream, { end: true });
   };
   
   
   this.getStatsOf = function getStatsOf(path) {
   
      var fileDescriptor = fs.openSync(path, 'r');
      var stats = fs.fstatSync(fileDescriptor);
      fs.closeSync(fileDescriptor);
      
      return stats;
   };
   

   this.getLastModifiedTimeOf = function getLastModifiedTimeOf(path) {
      
      var stats = this.getStatsOf(path);
      return stats.mtime;
   };
   
   
   this.exists = function exists(path) {
      return fs.existsSync(path);
   };
   
   
	this.getUtf8FileContent = function getUtf8FileContent(absolutePathOfFile) {
	
		var rawContent = fs.readFileSync(absolutePathOfFile, 'utf8');
		return removeByteOrderMark(rawContent);
	};
   
   
   this.remove = function remove(absolutePath) {
      
      if(this.getStatsOf(absolutePath).isDirectory()) {
         fs.rmdirSync(absolutePath);
      } else {
         fs.unlinkSync(absolutePath);
      }
   };

   
   this.writeFile = function writeFile(absolutePathOfFile, content) {
      fs.writeFileSync(absolutePathOfFile, content);
   };
   
   this.appendToFile = function appendToFile(absolutePathOfFile, content) {
      fs.appendFileSync(absolutePathOfFile, content);
   };
   
   this.readDir = function readDir(absolutePath) {
      return fs.readdirSync(absolutePath);
   };
   
   
   this.isDirectory = function isDirectory(absolutePath) {
      return this.getStatsOf(absolutePath).isDirectory();
   };
};

module.exports = Constructor;