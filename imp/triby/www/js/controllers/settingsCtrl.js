'use strict';
MyApp.controller('SettingsCtrl', function($scope, $ionicModal, $timeout, $ionicPopup, $state, $ionicViewService,
                                          SettingsService, UserService, $rootScope, $ionicLoading, $ionicPlatform,
                                          $cordovaCamera, $cordovaFile, CountryCodeService, _) {

  $scope.replaceLocation = function(newUrl) {
    window.location.replace(newUrl);
  };

  //disabling page jumping on input focus
  try {
    cordova.plugins.Keyboard.disableScroll(true);
  } catch(err) {}

	$ionicLoading.show({
		template: '<p> Loading </p><i class="icon ion-loading-c"></i>'
	});

  //$scope.countries = CountryCodeService.getCountryCode();

	$scope.user_data = {
		image : '',
		username : '',
		profilename : '',
    country : ''
	};

  $scope.errors = {
    usernamePattern: false
  };

  var usernamePattern = new RegExp(/^[0-9A-Za-z\. \_]+$/gmi);

  var GO_BUTTON_KEY_CODE = 13; // Same as Enter button

  function isUserDataValid() {
    if(!$scope.user_data.profilename.match(usernamePattern)
      || $scope.user_data.profilename.length < 2
      || $scope.user_data.profilename.length > 25
      || $scope.user_data.username.length < 2
      || $scope.user_data.username.length > 25 ) {
      return false;
    }

    return true;
  }

  function checkUsername(event) {
    if ($scope.user_data && !$scope.user_data.profilename) {
      $ionicPopup.show({
        template: '<div class="confirmation_text_box">' +
        '<div class="instruction_text">Username is required. Fill it please.' +
        '</div>',
        cssClass: 'confirmation_popup',
        scope: $scope,
        buttons: [
          {
            text: '<div class="confirm_number">Ok</div>',
            type: 'button-positive',
            onTap: function (e) {
            }
          }
        ]
      });

      event.preventDefault();
      return false;
    } else {
      //$ionicPlatform.offHardwareBackButton(checkUsername);
      window.history.back();

      event.preventDefault();
      return false;
    }
  }

	UserService.getUser().then(function(response){
    if(response.data && response.data.user && !response.data.user.profilename) {
      //$ionicPopup.alert({
      //  title: "Fill the username please!",
      //  cssClass: "username-err"
      //});

      $ionicPopup.show({
        template: '<div class="confirmation_text_box">' +
        '<div class="instruction_text">Fill the username please!' +
        '</div>',
        cssClass: 'confirmation_popup',
        scope: $scope,
        buttons: [
          {
            text: '<div class="confirm_number">Ok</div>',
            type: 'button-positive',
            onTap: function (e) {
            }
          }
        ]
      });
    }

    $scope.user_data = {
      username : response.data.user.username,
      profilename : response.data.user.profilename,
      country : response.data.user.country
		};

    $scope.$watch('user_data.profilename',function(newVal, oldVal){
      if($scope.user_data.profilename && $scope.user_data.profilename.replace) {
        $scope.user_data.profilename = $scope.user_data.profilename.replace(/ /g, '_');
        $scope.errors.usernamePattern = !$scope.user_data.profilename.match(usernamePattern);
      }
    });

    if(response.data.user.pic) {
			$scope.user_data.image = response.data.user.pic;
    } else {
			$scope.user_data.image = 'img/default_avatar.jpg';
    }

		$ionicLoading.hide();
	}, function(err) {
    window.plugins.toast.showShortCenter("Can't load profile info!", function (a) {
    }, function (b) {
      alert("Can't load profile info!");
    });
  });

	$scope.uploadPicture = function() {
    $ionicLoading.show({
      template: 'Uploading...'
    });
		SettingsService.uploadCropImage('AVATAR', null, 'avatar', true).then(function(response){

			$ionicLoading.hide();
			if(response.status === 'success'){
				$scope.user_data.image = response.url_file;
			} else {
        window.plugins.toast.showShortCenter("Error uploading picture", function (a) {
          console.log('toast success: ' + a)
        }, function (b) {
          alert('toast error: ' + b)
        });
      }
		}, function(err) {
      $ionicLoading.hide();
    });
	};

	$scope.saveProfile = function(){
    if(!$scope.user_data.profilename) {
      $ionicPopup.alert({
        title: "Username is required",
        cssClass: "username-err"
      });

      return;
    }

    if(!$scope.user_data.profilename.match(usernamePattern)) {
      $scope.errors.usernamePattern = true;
      return;
    }

    if(!isUserDataValid()) {
      return;
    }

		SettingsService.saveProfile($scope.user_data).then(function(response){
			console.log(response.status);
			if(response.status == "success"){
				$state.go('app.settings');
			}
			else {
        if(response.code && response.code === 409) {
          userNameIsNotUniq(response.message);
        } else {
          window.plugins.toast.showShortCenter("Error saving profile", function(a){console.log('toast success: ' + a)}, function(b){alert('toast error: ' + b)});
        }
      }
		});
	};

  $scope.backToSettings = function () {
    if ($scope.user_data && !$scope.user_data.profilename) {
      $ionicPopup.show({
        template: '<div class="confirmation_text_box">' +
        '<div class="instruction_text">Username is required. Fill it please.' +
        '</div>',
        cssClass: 'confirmation_popup',
        scope: $scope,
        buttons: [
          {
            text: '<div class="confirm_number">Ok</div>',
            type: 'button-positive',
            onTap: function (e) {
            }
          }
        ]
      });
    } else {
      window.history.back();
    }
  };

  function userNameIsNotUniq(title) {
    $ionicPopup.alert({
      title: title,
      cssClass: "username-err"
    });
  }

  $scope.keyUpHandler = function($event) {
    if ($event.keyCode === GO_BUTTON_KEY_CODE) {
      $scope.saveProfile();
    }
  }

  //$ionicPlatform.onHardwareBackButton(checkUsername);
  //
  //$scope.$on('$ionicView.leave', function () {
  //  $ionicPlatform.offHardwareBackButton(checkUsername);
  //});

});

MyApp.controller('ChangeNumberCtrl', function($scope, $ionicModal, $timeout, $ionicPopup, $state, SettingsService,$window) {

	$scope.numbers = {
		old_number : "",
		new_number : ""
	};

	$scope.changeNumbers = function(){
		SettingsService.changeNumbers($scope.numbers).then(function(response){

			if(response.status == "success")
				$state.go('app.settings');

			window.plugins.toast.showShortCenter(response.message, function(a){console.log('toast success: ' + a)}, function(b){alert('toast error: ' + b)});
		});
	}

});

MyApp.controller('FeedbackCtrl', function($scope, $ionicModal, $timeout, $ionicPopup, $state, SettingsService, $ionicViewService, $window) {

	$scope.feedback = {
		text : "",
    email: "",
		stars : [0,0,0,0,0],
		score: 0
	};

	$scope.showDone = $scope.score > 0 || $scope.feedback.text.length > 0;

  $scope.replaceLocation = function(newUrl) {
    window.location.replace(newUrl);
  };

	$scope.addStar = function(index){
		for(var i=0; i <= index; i++){
			$scope.feedback.stars[i] = 1;
		}

		for(var i=(index+1); i <= 4; i++){
			$scope.feedback.stars[i] = 0;
		}
	};

	function getScore(stars){
		var score = 0;
		for(var i=0; i < 5; i++){
			if(stars[i] == 1)
				score += 2;
		}
		return score;
	}

	$scope.saveFeedback = function(){
		$scope.feedback.score = getScore($scope.feedback.stars);
		SettingsService.saveFeedback($scope.feedback).then(function(response){
			if(response.status == "success"){
				$state.go('app.settings');
				window.plugins.toast.showShortCenter("Thank you for your feedback!", function(a){console.log('toast success: ' + a)}, function(b){alert('toast error: ' + b)});
			}
			else
				window.plugins.toast.showShortCenter(response.message, function(a){console.log('toast success: ' + a)}, function(b){alert('toast error: ' + b)});
		});
	};

});

MyApp.controller('DeleteNumberCtrl', function($scope, $ionicModal, $timeout, $ionicPopup, SettingsService,$window) {

	$scope.numbers = {
		old_number : ""
	};

	$scope.deleteUser = function(){
		SettingsService.removeUser($scope.numbers).then(function(response){
			console.log(response);
			if(response.status == "success")
				navigator.app.exitApp();

			window.plugins.toast.showShortCenter(response.message, function(a){console.log('toast success: ' + a)}, function(b){alert('toast error: ' + b)});
		});
	}

});

MyApp.controller('ContactsCtrl', function($scope, $ionicModal, $timeout, SettingsService,$window) {

	$scope.contacts = SettingsService.getContactsLocal();

	$scope.getContacts = function(){
		var obj = new ContactFindOptions();
        obj.filter = "";
        obj.multiple = true;

        console.log("navigator.contacts: " + navigator.contacts);
        var fields = ["id","displayName","phoneNumbers"];
        navigator.contacts.find(fields, contacts_success, contacts_fail, obj);
	};

	function contacts_success(contacts) {
		var lstContacts = [];

		for (var i=0; i<contacts.length; i++)
        {
        	if( contacts[i].phoneNumbers == null )
            continue;

        	if(contacts[i].phoneNumbers.length)
        		for (var j=0; j<contacts[i].phoneNumbers.length; j++){
        			 var pNumber = contacts[i].phoneNumbers[j].value;
        			 pNumber = pNumber.replace(/\s+/g, "")
        			 var name = contacts[i].displayName != null ? contacts[i].displayName: "No name";
        			 lstContacts.push(pNumber);
        		}

        }

        // Get triby concats from mobile directory
        SettingsService.getContacts({"contacts":lstContacts}).then(function(response){
        	$scope.contacts = response.users;
        	console.log(JSON.stringify(response));
        });
    }

    function contacts_fail(msg) {
        console.log("get_contacts() Error: " + msg);
    }

});
