angular.module('controller.intro', [])
.controller('IntroCtrl', function($state, $scope, $ionicPopup, $ionicSlideBoxDelegate, $ionicViewSwitcher, $model, $ionicPlatform, $localstorage, AUTH_EVENTS, ModalLoginSignupService, GENERAL_CONS, LokiDB) {

  $scope.title = "<div class='main-logo'><img src='img/logo.png' /> GET<span>FASH</span></div>";
  $scope.style = {
    casual: false,
    party: false,
    feminine: false,
    ontrend: false,
    sensual: false,
    work: false,
    dating: false,
    boyish: false,
    monocrhome: false,
    active: false
  } 

  $scope.sizes = {
    bustvalue: '',
    busttype: 'INCH',
    waistvalue: '',
    waisttype: 'INCH',
    hipvalue: '',
    hiptype: 'INCH',
    shouldervalue: '',
    shouldertype: 'INCH'
  }

  $scope.isValidStyle = false;
  $scope.preference = {
    gender: '',
    style: [],
    styleDisplay: [],
    sizing: []
  };

  $ionicPlatform.ready(function() {
    if(ionic.Platform.isIOS()){
      mixpanel.track("app_download", {
        "device": "IOS"
      });
    }else{
      mixpanel.track("app_download", {
        "device": "ANDROID"
      });
    }
  });

  $scope.getStyleByNumber = function(style){
    var result = "";
    switch(style) {
        case 1:
            result = "CASUAL";
            break;
        case 2:
            result = "PARTY";
            break;
        case 3:
            result = "FEMININE";
            break;
        case 4:
            result = "ON TREND";
            break;
        case 5:
            result = "SENSUAL";
            break;
        case 6:
            result = "WORK";
            break;
        case 7:
            result = "DATING";
            break;
        case 8:
            result = "BOYISH";
            break;
        case 9:
            result = "MONOCHROME";
            break;
        default:
            result = "ACTIVE";
    }
    return result;
  }

  $scope.styleChange = function(style, status) {
    if(status){
      $scope.preference.style.push(style);
      $scope.preference.styleDisplay.push($scope.getStyleByNumber(style));
    }else{
      for(var i = $scope.preference.style.length - 1; i >= 0; i--){
          if($scope.preference.style[i] == style){
              $scope.preference.style.splice(i,1);
              $scope.preference.styleDisplay.splice(i,1);
          }
      }
    }

    if($scope.preference.style.length > 2){
      $scope.isValidStyle = true;
    }else{
      $scope.isValidStyle = false;
    }
  };

  $scope.disableSwipe = function() {
     $ionicSlideBoxDelegate.enableSlide(false);
  };

  $scope.skip = function(){
    $localstorage.set(AUTH_EVENTS.SKIP, 1);
    
    $ionicViewSwitcher.nextDirection('forward');
    $state.go('tab.home');
  }

  $scope.nextStep = function() {
    $ionicSlideBoxDelegate.next();
  }

  $scope.prevStep = function() {
    $ionicSlideBoxDelegate.previous();
  }

  $scope.selectGender = function(gender){
    $scope.preference.gender = gender;
    $scope.nextStep();
  }

  $scope.getStarted = function(){
    if($scope.sizes.bustvalue == ''){
      $scope.sizes.bustvalue = 0;
    }
    if($scope.sizes.waistvalue == ''){
      $scope.sizes.waistvalue = 0;
    }
    if($scope.sizes.hipvalue == ''){
      $scope.sizes.hipvalue = 0;
    }
    if($scope.sizes.shouldervalue == ''){
      $scope.sizes.shouldervalue = 0;
    }

    //check measurement value:
    if(!angular.isNumber($scope.sizes.bustvalue) || !angular.isNumber($scope.sizes.waistvalue) || !angular.isNumber($scope.sizes.hipvalue) || !angular.isNumber($scope.sizes.shouldervalue)){
      $ionicPopup.alert({
       title: 'Size Suggestions',
       subTitle: 'Please enter valid numeric value'
      });
    }else{
      //sizing:
      $scope.preference.sizing.push({"measurement":2, "value":$scope.sizes.bustvalue, "measurementtype":$scope.sizes.busttype });
      $scope.preference.sizing.push({"measurement":3, "value":$scope.sizes.waistvalue, "measurementtype":$scope.sizes.waisttype });
      $scope.preference.sizing.push({"measurement":4, "value":$scope.sizes.hipvalue, "measurementtype":$scope.sizes.hiptype });
      $scope.preference.sizing.push({"measurement":5, "value":$scope.sizes.shouldervalue, "measurementtype":$scope.sizes.shouldertype });

      ModalLoginSignupService
      .init($scope, true)
      .then(function(modal) {
        modal.show();
      });
    }
  }

	$scope.$on('$ionicView.enter', function(){

	});

});


