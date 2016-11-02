'use strict';

angular.module('welzen')

.controller('DownloadsController', function($scope, $ionicHistory){
  $scope.goBack = function(count) {
   $ionicHistory.goBack(count);
  };
  $scope.downloads = [
    {
      title : "Guided Meditations",
      delete : false,
      courses : [
      {
        name : 'Quick Break',
        time : 2,
        delete : false
      },
      {
        name : 'Time meditating',
        time : 5,
        delete : false
      },
      {
        name : 'Total sessions',
        time : 15
      },
      ]
    },
    {
      title : "Coaching Sessions",
      delete : false,
      courses : [
      {
        name : 'Quick Break',
        time : 2,
        delete : false
      },
      {
        name : 'Time meditating',
        time : 5,
        delete : false
      },
      {
        name : 'Total sessions',
        time : 15,
        delete : false
      },
      ]
    }
  ];

  $scope.deleteAll = function(download, index) {
    if($scope.downloads[index].delete) {
      $scope.downloads.splice(index, 1);
    }else {
      $scope.downloads[index].delete = !$scope.downloads[index].delete;
    }
  };

  $scope.deleteOne = function(course, index) {
    if(course[index].delete) {
      course.splice(index,1);
    }else {
      course[index].delete = !course[index].delete;
    }
  };


})

;
