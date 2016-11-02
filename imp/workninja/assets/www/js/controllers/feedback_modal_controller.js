'use strict';

app.controller('FeedbackModalController', [
  '$scope',
  '$rootScope',
  '$state',
  '$window',
  '$timeout',
  'Job',
function($scope, $rootScope, $state, $window, $timeout, Job) {

  $scope.cancel = function() {
    $scope.feedbackModal.hide();
  };

  $scope.canSubmit = function() {
    return $scope.job && $scope.job.comment;
  };

  $scope.submit = function() {
    //wooble when job rating is not selected
    if(!$scope.job.rate) {
        $scope.run_wobble = true;
        $timeout(function(){
            $scope.run_wobble = false;
        }, 1000, true);

    }
    else {
        $scope.job.$feedback().then(function(job) {
            $scope.feedbackModal.hide();
            // successfull feedback, job is done
            $rootScope.$broadcast('event:job_closed', {job_id: job.id});
        }, function(errors) {
            console.log(errors);
            console.log('[FeedbackModalController] TODO: handle feedback errors');
        });
    }
  };

  $scope.taFocus = function() {
    $window.scrollTo(0,0);
    if ($window.cordova) {
      $window.cordova.plugins.Keyboard.disableScroll(true);
    }
  };

  $scope.taBlur = function() {
    $window.scrollTo(0,0);
    if ($window.cordova) {
      $window.cordova.plugins.Keyboard.disableScroll(true);
    }
  };

  $scope.shareViaTwitter = function() {
    console.log('shareViaTwitter');
    if ($window.plugins && $window.plugins.socialsharing) {
      $window.plugins.socialsharing.shareViaTwitter(
        'I just hired a Work Ninja! Thanks @goworkninja'  // message
      )
    }
  };

  $scope.shareViaFacebook = function() {
    console.log('shareViaFacebook');
    if ($window.plugins && $window.plugins.socialsharing) {
      $window.plugins.socialsharing.shareViaFacebook(
        'I just hired a Work Ninja!',  // message
        null,  // img
        'https://www.facebook.com/WorkNinja'  // link
      )
    }
  };

  $scope.shareViaEmail = function() {
    console.log('shareViaEmail');
    if ($window.plugins && $window.plugins.socialsharing) {
      $window.plugins.socialsharing.shareViaEmail(
        'I just hired a <a href="http://workninja.com">Work Ninja</a>!',  // message
        'WorkNinja',  // subject
        null,
        'http://workninja.com/'
      )
    }
  };

  //$scope.share = function() {
  //  if ($window.plugins && $window.plugins.socialsharing) {
  //    $window.plugins.socialsharing.share(
  //      'I just hired a Work Ninja! Thanks @goworkninja',
  //      'Work Ninja',
  //      null,
  //      'http://workninja.com/'
  //    )
  //  }
  //};
}]);
