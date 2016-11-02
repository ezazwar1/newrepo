'use strict';

angular.module('welzen')

.controller('cancelSubsCtrl', function($scope) {

	var isAndroid = ionic.Platform.isAndroid();
	if (isAndroid){
		$scope.cancelText = "Open the Google Play Store on your Android smartphone or tablet. Then, Open the My Apps section via the Google Play Store menu. To the left of Installed apps is a list of your subscriptions. Here you can select the one you wish to cancel. Click the Cancel button and confirm the action by hitting Yes. Your subscription will now be cancelled and you will be able to carry on using the service until the end of your subscription period. Google will send you a confirmation email."
	}else{
		$scope.cancelText = "To manage your subscription on your iOS device, launch the App Store and make sure you're viewing the Featured tab. Scroll to the bottom, tap on the Apple ID button, and then select View Apple ID."
	}

});
