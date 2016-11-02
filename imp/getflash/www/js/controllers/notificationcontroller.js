angular.module('controller.notification', ['notification.services'])
.controller('NotificationCtrl', function($scope, $ionicPlatform, $model, GENERAL_CONS, $state, AUTH_EVENTS, $localstorage, ModalLoginSignupService, NotificationService) {
    $scope.title = "<div class='short-logo'><img src='img/logo-short.png' /> NOTIFICATIONS</div>";
    $scope.feeds = [];
    $scope.notificationFirstTimeLoader = true;
    $scope.displayNotificationEmpty = false;
    $scope.backToHome = true;

    $scope.$on('$ionicView.beforeEnter', function() {
      $localstorage.set(GENERAL_CONS.TABACTIVE, 5);

      if($localstorage.get(GENERAL_CONS.LOADNOTIF) == 1){
        $scope.doReload();
        $scope.doAck();
        $localstorage.set(GENERAL_CONS.LOADNOTIF, 0);
      }

      if(!$localstorage.get(AUTH_EVENTS.AUTHENTICATED)){
        ModalLoginSignupService
        .init($scope, false)
        .then(function(modal) {
          modal.show();
        });
      }
    });

    $ionicPlatform.ready(function() {
      //Load latest notification
      var promise = NotificationService.loadMyNotifications();
      promise.then(function(result){
        if(result != null){
          addFeed(result.notifications);
        }else{
          $scope.displayNotificationEmpty = true;
        }

        $scope.notificationFirstTimeLoader = false;
      });
    });

    var addFeed = function(feeds){
      for(var i = 0; i < feeds.length; i++){
        var objToAdd = new $model.Notification(feeds[i]._id.$oid, feeds[i].title, feeds[i].message, feeds[i].notifpic, feeds[i].notiftype, feeds[i].status, feeds[i].createddate, feeds[i].targetid.$oid, feeds[i].sender.$oid, feeds[i].sendername);
        $scope.feeds.push(objToAdd);
      }

      if($scope.feeds.length < 1){
        $scope.displayNotificationEmpty = true;
      }
      
    };

    $scope.doReload = function() {
      var promise = NotificationService.loadMyNotifications();
      promise.then(function(result) {
        if(result != null){
          $scope.feeds = []; //reset

          $scope.displayNotificationEmpty = false;
          addFeed(result.notifications);
        }else{
          $scope.displayNotificationEmpty = true;
        }

        $scope.$broadcast('scroll.refreshComplete');
      });
    };

    $scope.goTo = function(type, targetid, senderid){
      //notification route:
      if(type == "N1" || type == "N2" || type == "N3" || type == "N5" || type == "N6"){
        $state.go("tab.more-article-detail", {"articleID":targetid, "notifType": type});
      }else if(type == "N4"){
        $state.go('tab.more-item-detail', {'itemID':targetid});
      }
    };

    $scope.doAck = function(){
      //background ack:
      var promise = NotificationService.doAckNotification();
      promise.then(function(result) {
        if(result){}
      });
    };


});