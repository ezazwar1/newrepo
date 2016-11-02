'use strict';
MyApp.controller('HomeCtrl', ['$scope', '$rootScope', '$location', '$timeout', '$state', '$ionicLoading', 'UserService', 'FeedService', 'tribes', '_',
  function($scope, $rootScope, $location, $timeout, $state, $ionicLoading, UserService, FeedService, tribes, _) {

  if (window.StatusBar) {
    StatusBar.overlaysWebView(true);
  }

    $scope.userAgent = (navigator.userAgent.match(/iPad/i))  == "iPad" ? "iPad" : (navigator.userAgent.match(/iPhone/i))  == "iPhone" ? "iPhone" : (navigator.userAgent.match(/Android/i)) == "Android" ? "Android" : (navigator.userAgent.match(/BlackBerry/i)) == "BlackBerry" ? "BlackBerry" : "null";
      console.log('$scope.userAgent!!!!!!!!!!!!!!!1', $scope.userAgent);

  if(tribesNotificationListener && typeof tribesNotificationListener === 'function') {
    tribesNotificationListener();
  }

  if(removedMemberListener && typeof removedMemberListener === 'function') {
    removedMemberListener();
  }

  var tribesNotificationListener = $rootScope.$on('tribes_notification', function(tribeInfo, message) {
    var badge = document.getElementById('badge_' + message._id);
    if(!badge) return;

    badge.innerHTML = message.notifications;
    if(message.notifications > 0) {
      badge.classList.remove('ng-hide');
    } else {
      badge.classList.add('ng-hide');
    }

    var tribeIndex = _.findIndex($scope.tribes, function(c){ return c._id==message._id});
    if (tribeIndex > -1) {
      $timeout(function() {
        $scope.tribes[tribeIndex].lastMessage = new Date().toISOString();
      }, 10);
    }

  });

  var removedMemberListener = $rootScope.$on('removed_from_tribe', function(message, messageData) {
    console.log('removed_from_tribe: homectrl', arguments);

    if($state.current.name !== 'app.main.home') return;

    for(var i = 0; i < $scope.tribes.length; i++) {
      var tribeIndex = _.findIndex($scope.tribes[i], function (item) { return item._id === messageData.tribeId});
      if (tribeIndex > -1) {
        $scope.tribes[i].splice(tribeIndex, 1);

        var allTribes = [];
        $scope.tribes.map(function(tribesSet){
          allTribes = allTribes.concat(tribesSet)
        });

        $scope.tribes = chunk(allTribes, 2);
        $scope.$apply();
        break;
      }
    }
  });

  var addedToNewGroupListener = $rootScope.$on('added_to_group', function(message, messageData) {
    var tribeAlreadyExist = false;
    console.log('added_to_group: homectrl', arguments);

    if($state.current.name !== 'app.main.home') return;

    for(var i = 0; i < $scope.tribes.length; i++) {
      var tribeIndex = _.findIndex($scope.tribes[i], function (item) { return item._id === messageData.tribeId});
      if (tribeIndex > -1) {
        tribeAlreadyExist = true;
        break;
      }
    }

    if(!tribeAlreadyExist) {
      reloadTribies()
    }

    //$rootScope.$emit('added_to_group', message);
  });

  $scope.tribes = {};
//  $scope.existsTribies = tribes.data.tribes.length === 0;
  $scope.existsTribies = tribes.data.tribes.length > 0;
  console.log('tribes.data.tribes!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!', tribes.data.tribes);
  $scope.tribes = chunk(tribes.data.tribes, 2);
  $scope.showCreateTribyBar = false;

  if (!tribes.data.tribes.length) {
    $scope.showCreateTribyBar = true;
  }

  function chunk(arr, size) {
    var newArr = [];
    for (var i=0; i<arr.length; i+=size) {
      newArr.push(arr.slice(i, i+size));
    }
    return newArr;
  }

  function reloadTribies() {
    $ionicLoading.show({
      template: '<p> Loading </p> <i class="icon ion-loading-c"></i>'
    });

    FeedService.getTribes().then(function(response){
      //sometimes when new pubnub subscription made info lost (specially for unread service)
      var unreadCounter = 0;
      if(response.data.status === "success") {
        if (response.data.tribes && response.data.tribes.length > 0) {
          for (var i = 0; i < response.data.tribes.length; i++) {
            if (response.data.tribes[i].unreadNotifications && response.data.tribes[i].unreadNotifications > 0) {
              unreadCounter = unreadCounter + response.data.tribes[i].unreadNotifications;
            }
          }
        }
        $rootScope.unreadGroupsNotifications = unreadCounter;
      }

      $scope.existsTribies = response.data.tribes.length > 0;
      $scope.tribes = chunk(response.data.tribes, 2);
      $scope.showCreateTribyBar = false;

      if (!response.data.tribes.length) {
        $scope.showCreateTribyBar = true;
      }

      $ionicLoading.hide();
    }, function(err){
      $ionicLoading.hide();

      window.plugins.toast.showShortCenter("Can't load new group!", function (a) {
      }, function (b) {
        alert("Can't load new group!");
      });
    });
  }

  $scope.$on('$destroy', function() {
    tribesNotificationListener();
    removedMemberListener();
    addedToNewGroupListener();
  });

}]);

MyApp.filter('searchTriby', function() {
	return function(arr, searchString) {
		if (!searchString) {
			return arr;
		}
		var result = [];
		searchString = searchString.toLowerCase();
		angular.forEach(arr, function(item) {
			if (item.name.toLowerCase().substr(0, searchString.length) === searchString)
				result.push(item);
		});
		return result;
	};
});
