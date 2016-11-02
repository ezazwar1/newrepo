angular.module('starter.controllers', ['ionic'])

.controller('AppCtrl', function($scope,$rootScope,$state, $ionicModal,$interval,$location,$ionicPopover,$ionicSideMenuDelegate,$filter,categoryService,progressService) {

	$scope.toggleLeftSideMenu = function() { $ionicSideMenuDelegate.toggleLeft();  
   
	};

	// Notification Modal
	$ionicModal.fromTemplateUrl('templates/modules/notification.html', {
	scope: $scope
	}).then(function(modalNotification) {
	$scope.modalNotification = modalNotification;
	});
	$scope.closeNotification = function() {
	$scope.modalNotification.hide();
	};
	$scope.openNotifications = function() {
	$scope.modalNotification.show();
	};

	$rootScope.$on('$stateChangeSuccess',
	function(event, toState, toParams, fromState, fromParams) {
	$rootScope.currentState=toState;
	}
	)

	//--------Get Category------------------------
	$rootScope.accordionConfig = {
		debug: false, //For developing
		animDur: 300, //Animations duration minvalue is 0
		expandFirst: false, //Auto expand first item
		autoCollapse: true, //Auto collapse item flag
		watchInternalChanges: false, //watch internal attrs of the collection (false if not needed)
		headerClass: '', //Adding extra class for the headers
		beforeHeader: '', //Adding code or text before all the headers inner content
		afterHeader: '', //Adding code or text after all the headers inner content
		topContentClass: '', //Adding extra class for topContent
		beforeTopContent: '', //Adding code or text before all the topContent if present on item
		afterTopContent: '', //Adding code or text after all the topContent if present on item
		bottomContentClass: '', //Adding extra class for topContent
		beforeBottomContent: '', //Adding code or text before all the topContent if present on item
		afterBottomContent: '', //Adding code or text before all the topContent if present on item
		menuLink: '#/app/categories' //Adding code or text before all the topContent if present on item
	};
	categoryService.getCategories()
	.then(function(response) {
		//console.log(response);
		// angular.forEach	(response.data.data,function(value, key){
		// 	//response.data.data[key].small_icon="";
		// 	})
		$rootScope.menuAccordionArray = response.data.data;
		//console.log($rootScope.menuAccordionArray);
		$rootScope.searchDefaultCats = getAutoSuggest($rootScope.menuAccordionArray);
		//console.log($rootScope.searchDefaultCats);
		//console.log($rootScope.searchDefaultCats);
		//$rootScope.searchDefaultCats = getAutoSuggest($rootScope.accordionArray);
	}, function(error) {
		$rootScope.tostMsg(error);
	});
//----search bar-----
	$scope.popularSearch = [{heading:'Popular Search',items:[{id:1,title:'Game tables',parent_category:'ACCENT'},{id:2,title:'Ashley Dining Set',parent_category:'DINING'},{id:3,title:'Futon Chairs',parent_category:'LIVING'},{id:4,title:'Conference Table',parent_category:'OFFICE'},{id:5,title:'Harbor Cabinet',parent_category:'STROAGE'}]}];
	$scope.getSearchResult = function(keywords){
		$scope.searchCats = $filter('filter')($scope.searchDefaultCats, { title: keywords });
		// console.log($scope.searchDefaultCats);
		// console.log($scope.searchCats);
		if($scope.searchCats=='') $scope.searchCats = '';
	}
	$scope.resetSearch = function(keywords){ $scope.searchCats = '';	}
	$scope.searchProduct = function(cat_id,title){
	// console.log(cat_id);
	// console.log(title);
		// $location.path("app/search/"+cat_id+"/"+title.replace("&amp;","and"));
		$location.path("app/products/"+cat_id+"/"+title.replace("&amp;","and"));

	}
//-----------------------------------------
		//code for the toggle effect of the category section wit default section
		 $scope.isCategory=true;
			$scope.cattoggle = function(){
			 if($scope.isCategory){
			$scope.isCategory=false;
		}
		else{
			$scope.isCategory=true;
			}
		 };
		 //----------------User Login-----------------------------------
			 $scope.logindata = {username:'',password:'',device_uuid:''};
			 $scope.userLogin = function(form){
					 $scope.logindata.device_uuid = $scope.device_uuid;
					 if(form.$valid) {
						//  usersService.userLogin($scope.logindata)
						//  .then(function(response){
						// 	 if(response.status){
						// 		 $scope.logindata = {username:'',password:''};
						// 		 $scope.usermaster.access_token = response.data;
						// 		 $scope.getUserProfile(response.data);
						// 		 $scope.userModal(1,'hide');
						// 	 }
						// 	 alertmsgService.tostMessage(response.msg);
						//  });
						//console.log('success');
						progressService.showLoader();
						$scope.uModal.hide();
						setTimeout(function(){ progressService.hideLoader();}, 3000);
						$location.path("app/dashboard");
					 }
			 }
			 $scope.userLoginPassword = function(form){
					 $scope.logindata.device_uuid = $scope.device_uuid;
					 if(form.$valid) {
						progressService.showLoader();
						setTimeout(function(){ progressService.hideLoader();}, 2000);
						$location.path("app/dashboard");
					 }
			 }
		 //----------------Get User Profile-----------------------------------

			//  $scope.getUserProfile = function(authData){
			 //
			// 	 usersService.userProfile(authData)
			// 	 .then(function(response){
			// 		 console.log(response);
			// 		 if(response.status){
			// 			 $scope.usermaster.username		= response.data.username;
			// 			 $scope.usermaster.name			= response.data.name;
			// 			 $scope.usermaster.email			= response.data.email;
			// 			 $scope.usermaster.logintype		= response.data.logintype;
			// 			 $scope.usermaster.profile_img	= response.data.profile_img;
			 //
			// 			 $localStorage.usermaster = $scope.usermaster;
			// 		 }
			// 		 //alertmsgService.tostMessage(response.msg);
			// 	 });
			 //
			//  }
		 //-------------Forgot Password----------------------------------
			 $scope.forgotdata = {email:''};
			 $scope.forgotPwd = function(form){
					 if(form.$valid) {
						//  usersService.userForgetPassword($scope.forgotdata)
						//  .then(function(response){
						// 	 if(response.status)$scope.forgotdata = {email:''};
						// 	 alertmsgService.tostMessage(response.msg);
						//  });
						progressService.showLoader();
						$scope.uModal.hide();
						setTimeout(function(){ progressService.hideLoader();}, 3000);

					 }
			 }
		 //-----------Register-----------------------------------------
			 $scope.userdata = {fullname:'',useremail:'',password:'',confirm_password:''};
			 $scope.userRegister = function(form){
					 if(form.$valid) {
						//  usersService.userSignup($scope.userdata)
						//  .then(function(response){
						// 	 if(response.status)$scope.userdata = {fullname:'',useremail:'',password:'',confirm_password:''};
						// 	 alertmsgService.tostMessage(response.msg);
						//  });
						progressService.showLoader();
						$scope.uModal.hide();
						setTimeout(function(){ progressService.hideLoader();}, 3000);
					 }
			 }
		 //----------------User Modals--------------------------------
		 $scope.userModal = function(index,action,animation,active) {

		 	//console.log(index);
		 	$scope.modal_url		='';
		 	$scope.modal_index		= index;
		 	if(animation===undefined) $scope.modal_animation ='fadeIn'; else $scope.modal_animation = animation;
		 	if(index == 1)	$scope.modal_url = 'js/userauth/modal-login.html';
		 	if(index == 2)  $scope.modal_url = 'js/userauth/modal-signup.html';
		 	if(index == 3)  $scope.modal_url = 'js/userauth/modal-forgotpassword.html';

		 	if(action!='hide'){
		 		if($scope.uModal)$scope.uModal.hide();
		 		$ionicModal.fromTemplateUrl($scope.modal_url, {
		 			id: $scope.modal_index, // We need to use and ID to identify the modal that is firing the event!
		 			scope: $scope,
		 			backdropClickToClose: false,
		 			animation: 'animated ' + $scope.modal_animation,
		 			hideDelay:920
		 		}).then(function(modal) {
		 				$scope.uModal = modal;
		 				$scope.uModal.show();
		 		});
		 	}
		 	if(action=='hide'){
				$scope.uModal.hide();
			}

		 }


})
