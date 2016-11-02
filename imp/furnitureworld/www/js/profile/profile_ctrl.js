angular.module('starter.controllers')
.controller('ProfileCtrl', function($scope,$rootScope,$ionicModal,$timeout) {
	'use strict';
	// $scope.isProfileImg = true;
	//  //action sheet for upload photo button
	// $scope.showActionsheetphoto = function() {
	//
	// 	$ionicActionSheet.show({
	// 		buttons: [  { text: 'TAKE PHOTO' }, { text: 'PHOTO FROM LIBRARY' } ],
	//
	// 		cancelText: 'Cancel',
	// 		cancel: function() {  $scope.isProfileImg = true;   },
	// 		buttonClicked: function(index) {
	// 			$scope.isProfileImg = false;
	// 			$scope.selectImage(index);
	// 			return true;
	// 		}
	// 	});
	// }
	//
	// $rootScope.imgv = 1;
	// $scope.selectImage = function(index){
	// 	ImageService.handleProfileImage(index,$scope.device_uuid)
	// 	.then(function(result){
	// 		 if(result.status){
	// 			 $rootScope.imgv++;
	// 			 $scope.usermaster.profile_img	= result.data+"?v="+$rootScope.imgv;
	// 		 }else{
	// 			 alertmsgService.tostMessage('Failed to update image.Please try again.');
	// 		 }
	// 		 $scope.isProfileImg = true;
	// 	}, function(error) {
	// 		alertmsgService.tostMessage('Failed to update image.Please try again.');
	// 					scope.isProfileImg = true;
	// 	 });
	// }
	//
	// 	$scope.pwdData = {oldpassword:'',newpassword:'',access_token:'',access_token:''}
	// $scope.updatePassword = function(){
	// 	$scope.pwdData .access_token = $scope.usermaster.access_token;
	//
	// 	usersService.userChangePassword($scope.pwdData)
	// 	.then(function(response){
	// 		if(response.status){
	// 			$scope.pwdData = {oldpassword:'',newpassword:'',access_token:'',access_token:''}
	// 		}else{
	// 			$scope.pwdData.access_token = '';
	// 		}
	// 		alertmsgService.tostMessage(response.msg);
	// 	}, function(error) {
	// 		alertmsgService.tostMessage('Request Failed. Please try again.');
	// 	 });
	// }
});
