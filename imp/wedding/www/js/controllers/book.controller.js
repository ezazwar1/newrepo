angular.module('book.controller', ['ngCordova'])
.controller('BookCtrl', function($scope, $stateParams,$ionicListDelegate,$cordovaGoogleAnalytics,$ionicPlatform,$cordovaGoogleAnalytics,$cordovaDialogs) {
  $ionicPlatform.ready(function() {
    if (window.StatusBar) {
      $cordovaGoogleAnalytics.trackView('Greetings Screen');
    }
  });
   

	$scope.doRefresher = function() {
	    console.log('Refreshing greet list data');
	    $scope.getData();
	  };


$scope.deleteGreeting = function(bid) {
      // if (!confirm('Really delete greeting?')) {
      //   console.log('Delete aborted by user');
      //   return false;
      // }

    $cordovaDialogs.confirm('Really delete greeting?', 'Wedivite', ['Yes','No!'])
    .then(function(buttonIndex) {
      // no button = 0, 'OK' = 1, 'Cancel' = 2
      if (buttonIndex == 1) {
        
    $scope.show();
    var uid = localStorage.user_id;
    var hash = localStorage.hash;
    
    /* Test if new version or old */
    if (uid > 30000) {
      var apiUrl = 'http://app.wedivite.com/api/set';
    } else {
      var apiUrl = 'http://www.wedivite.com/apiv2/set.php';
    }
    
    $.ajax({
    type: 'POST',
    url: apiUrl,
    data: { uid: uid, hash: hash, set: 'delgreet', bid: bid },
    dataType: 'json',
    timeout: 20000,
    statusCode: {
      400: function() {
        alert('Error 400');
        $scope.hide();
        return;   
      }, 
      401: function() {
        alert('Error 401');
        $scope.hide();
        return;
      },
      500: function() {
        alert('Oops! This guest is not on the list');
        $scope.hide();
        return;
      }
    },
    error: function(){
          alert('We can\'t get in touch with our mother ship. Are you connected to the internet?');
          $scope.hide();
      return;         
    },
    success: function( resp ) {
      console.log(resp);
      $.each(resp, function(index, element) {
        if (element == 'OK') {
          console.log('Greeting deleted in server');
          $scope.hide();
          $scope.getData();
          return true;
        }
        if (element == 'error') {
          alert('Error deleting greeting, please try again later or use our desktop version.');
          $scope.hide();
          return false;
        }       
      });
    },
  }); 
      }
    });
      
}



      
    $scope.swipeHelper= function(isFirst){
     if (isFirst == true && !window.localStorage['seen_book_swipe']) {
      setTimeout(function() { window.localStorage['seen_book_swipe'] = true }, 40000);
        return "swiperhelper";
     } else {
         return "";
      }
    };
  

    //$scope.greetings = [
    // { text: 'Love you guys!!!',by: 'Max Richter', id: 1 },
    //{ text: 'Im so looking forward to it, cant wait already ahahahahhahahha this is amazing!!! yeahh',by: 'Don Johnson', id: 2 }
  //];
});

