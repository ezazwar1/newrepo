'use strict';

MyApp.service('LoadingService', function ($rootScope) {
  function setPercentage(value) {
    $rootScope.progressBar.val = value;
  }

  function increment() {
    $rootScope.progressBar.val = $rootScope.progressBar.val + 0.1;
  }

  return {
    setPercentage: setPercentage,
    increment: increment
  };

});
