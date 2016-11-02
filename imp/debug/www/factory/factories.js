angular.module('photoshare')
.factory('ConnectivityMonitor', ['$rootScope', '$cordovaNetwork',
	function ($rootScope, $cordovaNetwork) {

		return {
			isOnline: function(){
				if(ionic.Platform.isWebView()){
					return $cordovaNetwork.isOnline();    
				} else {
					return navigator.onLine;
				}
			},
			isOffline: function(){
				if(ionic.Platform.isWebView()){
					return !$cordovaNetwork.isOnline();    
				} else {
					return !navigator.onLine;
				}
			},
			startWatching: function(){
				if(ionic.Platform.isWebView()){
					$rootScope.$on('$cordovaNetwork:online', function(event, networkState){
						console.log("went online");
					});
					
					$rootScope.$on('$cordovaNetwork:offline', function(event, networkState){
						console.log("went offline");
					});
				}else{
					window.addEventListener("online", function(e) {
						console.log("went online");
					}, false);    
					
					window.addEventListener("offline", function(e) {
						console.log("went offline");
					}, false); 
				}
			}
		};
	}])