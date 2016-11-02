'use strict';

angular.module('welzen')

.controller('settingsCtrl', function($scope, $state) {

	$scope.shareApp = function(){
		console.log("shareApp welzen");
		if(window.plugins && window.plugins.socialsharing){
			window.plugins.socialsharing.share("Hey, I thought this may be an interesting app for you to try. It's about mindfulness meditation", 
										'Welzen', 
										 null, 
										'http://welzen.org');
      	}else{
        	console.warn("Share not enabled");
      	}
	}

	$scope.reviewApp = function(){
		console.log("reviewapp welzen");
		AppRate.promptForRating();
	}

	$scope.goBack = function(){
		$state.go("main");
	}

});


