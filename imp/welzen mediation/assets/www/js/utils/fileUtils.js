angular.module('welzen').factory('fileUtils', fileUtils);

function fileUtils($ionicPlatform, $cordovaFile, $q, $http){

	var fileUtils = {
		readFile: readFile		
	};

	return fileUtils;

	function readFile(fileDir, fileName){
		var deferred = $q.defer();
		$ionicPlatform.ready(function() { 
			if ( typeof cordova !== 'undefined') {
				$cordovaFile.readAsText(cordova.file.dataDirectory, fileName)
					.then(function (result) {
						if(result === null  || result.length === 0){
							readInternalFile(deferred,fileDir,fileName);
						}else{
							console.log('lo leo del disco');
							deferred.resolve(JSON.parse(result));						
						}
					}, function (error) {
						//puede q aun no exista el archivo
						if(error.code == 1){
							readInternalFile(deferred,fileDir,fileName);				
						}
					});
			} else {
				readInternalFile(deferred,fileDir,fileName);	
			}
		});
		return deferred.promise;
	}

	function readInternalFile(deferred,fileDir,fileName){
		$http.get(fileDir + "/" + fileName)
			.then(function(res){
				deferred.resolve(res.data);
			});
	}

}