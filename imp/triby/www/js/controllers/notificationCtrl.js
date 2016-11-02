'use strict';

MyApp.controller('NotificationCtrl', function ($scope,
                                               $state,
                                               NotificationService,
                                               _) {

  $scope.notificationEvents = [];
  $scope.isMoreLoadingAllowed = true;

  $scope.loadMoreNotificationEvents = function() {
    NotificationService.getNotificationEvents({'skip':$scope.notificationEvents.length}).then(function(events) {

      if (!events || events.length == 0) {
        $scope.isMoreLoadingAllowed = false;
      }

      _.each(events, function (event) {
        $scope.notificationEvents.push(event);
      });

      $scope.$broadcast('scroll.infiniteScrollComplete');
    });
  };

  $scope.markReadAll = function () {

    NotificationService.markAsViewedAll();

    _.each($scope.notificationEvents, function (event) {
      event.isViewed = true;
    });

  };

});
