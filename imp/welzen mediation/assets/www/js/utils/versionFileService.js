(function() {
	'use strict';

var myApp = angular.module('welzen');

myApp.factory('VersionFileService', VersionFileService);
	
	function VersionFileService($ionicPlatform, $http, $q, $interval, $cordovaFile, FileParams, WelzenAPI, MeditationOfflineService) { 

		var VersionFileService = {
			updateFile : updateFile
		};

		var self = VersionFileService;

		var internetRetry = 0;

		return VersionFileService;

		function updateFile(){
			//busco la ultima version en el server
			//como puede no tener internet creo un $interval para q reintente cada 30''
			if(typeof cordova != 'undefined'){
				angular.forEach(FileParams, function(fileParam, key){
					fileParam.stop = $interval(function() {getVersionFile(fileParam);}, 30000);
					//lo fuerzo a q arranque en el minuto 0
					getVersionFile(fileParam);
				});
			}else{
				console.log('cordova.file not defined...corriendo en el browser?');
			}
		}		

		function getVersionFile(fileParam){
			$http.get(eval(fileParam.urlHead)).
				then(function(response) {
					if(response.data === null){
						console.log('no internet');
						internetRetry++;
						if(internetRetry === 5){
							console.log('stop retrying, time out');
							$interval.cancel(fileParam.stop);
						}
						return;
					}
					//paro el interval
					fileParam.version = response.data.version;
					if(fileParam.version !== null){
						$interval.cancel(fileParam.stop);
						console.log('checkVersion::encontré versión: ' + fileParam.version + ' para: ' + fileParam.fileName);
						compareVersions(fileParam);						
					}else{
						console.log("esta conectado a un wifi sin salida a internet: "+ JSON.stringify(response));
					}
				}, function(response) {
					console.log('checkVersion::debo estar offline sigo intentando: ' + JSON.stringify(response));
			});
		}

		function compareVersions(fileParam){
			//primero me fijo si existe un archivo interno (sería el más actualizado, a diferencia del empaquetado)
			$ionicPlatform.ready(function() { 			
				$cordovaFile.readAsText(cordova.file.dataDirectory, fileParam.fileName)
					.then(function (result) {
						if(result == null  || result.length==0){
							readInternalFile(fileParam);
						}else{
							var res = JSON.parse(result);
							if( res.version < fileParam.version){
								console.log('checkVersion::tienen una version mas vieja ' + ' para: ' + fileParam.fileName);
								downloadNewFile(fileParam);
							}else{
								console.log('checkVersion::tienen la misma version, el archivo esta actualizado: ' + fileParam.fileName);
							}								
						}
					}, function (error) {
						//puede q aun no exista el archivo
						if(error.code == 1){
							console.log('checkVersion::no existe el archivo: ' + fileParam.fileName);
							readInternalFile(fileParam);
						}
					});
			})
		}

		function readInternalFile(fileParam){
			//si tengo archivo desde javascript lo leo, sino el plugin hace el resto
			if(fileParam.hasAppFile){
				//uso el local
				//leo la version desde el archivo y la comparo con el del server
				$http.get('meditationdata/' + fileParam.fileName)
					.then(function(res){
						if( res.data.version < fileParam.version){
							console.log('checkVersion::tienen una version mas vieja para: ' + fileParam.fileName);
							downloadNewFile(fileParam);
						}else{
							console.log('checkVersion::tienen la misma version, el archivo esta actualizado: ' + fileParam.fileName);
						}
					});
			} else{
				downloadNewFile(fileParam);
			}				
		}

		function downloadNewFile(fileParam){
			var jsonURL = eval(fileParam.urlFile);

			var req = {
				method: "GET",
				url: jsonURL,
				headers: {
					"Content-Type": "application/json; charset=utf-8"
				}
			};

			console.log('checkVersion::comienzo la descarga del archivo...va a demorar un rato: ' + fileParam.fileName);		
			$http(req)
				.then(function(res){
					fileParam.data = res.data;
					writeNewFile(fileParam);
				}, function(res){
					console.log('checkVersion::falló descarga archivo', JSON.stringify(res));
				});
		}

		function writeNewFile(fileParam){
			//en iOS necesita q sea un String, en Android un objeto:
			var data = fileParam.data;
			if(ionic.Platform.isIOS()){
				data = JSON.stringify(data);
			}
			$cordovaFile.writeFile(cordova.file.dataDirectory, fileParam.fileName, data, true)
				.then(function (success) {
				// success
				console.log('checkVersion::guardo ok el nuevo archivo: ' + fileParam.fileName );
				if(fileParam.hasCallback){
					eval(fileParam.callbackFn)(fileParam.data);
				}
			}, function (error) {
				console.log('checkVersion::fallo guardar archivo: ' + JSON.stringify(error));
			});
		}
	}

})();