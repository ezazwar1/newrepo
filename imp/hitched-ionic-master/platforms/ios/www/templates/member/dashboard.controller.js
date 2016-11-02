'use strict';

angular.module('HitchedApp')
  .controller('DashboardCtrl', function($scope) {

    $scope.idx = 0;
    $scope.currFeature = 'welcome';
    $scope.currFeatureSrc = 'app/member/features/' + $scope.currFeature + '/' + $scope.currFeature;

    // App features
    $scope.features = [
    {
      'title': 'Home',
      'template': 'welcome',
      'img': 'glyphicon-home',
      'class': 'box-primary',
      'idx': 0
    },
    {
      'title': 'Wedding Info',
      'template': 'wedding',
      'img': 'glyphicon-info-sign',
      'class': 'box-primary',
      'idx': 1
    }, {
      'title': 'Games',
      'template': 'games',
      'img': 'glyphicon-flag',
      'class': 'box-primary',
      'idx': 2
    }, {
      'title': 'Customize App',
      'template': 'customize',
      'img': 'glyphicon-cog',
      'class': 'box-primary',
      'idx': 3
    },{
      'title': 'Guests',
      'template': 'guests',
      'img': 'glyphicon-user',
      'class': 'box-primary',
      'idx': 4
    },  {
      'title': 'Photos',
      'template': 'photos',
      'img': 'glyphicon-camera',
      'class': 'box-primary',
      'idx': 5
    }];

    $scope.selectFeature = function(template, idx) {
      $scope.idx = idx;
      $scope.currFeature = template;
      $scope.currFeatureSrc = 'app/member/features/' + $scope.currFeature + '/' + $scope.currFeature;

      if($scope.idx === 0){
        $('body').animate({
          scrollTop: 0
        }, 'slow');
      }else{
        $('body').animate({
          scrollTop: ($('.dashboard-container').position().top - 50)
        }, 'slow');
      }
    };

    $scope.nextFeature = function(){
      var nextIdx = $scope.idx + 1;
      
      if(nextIdx < $scope.features.length){
        var nextFeature = $scope.features[nextIdx];
        $scope.selectFeature(nextFeature.template, nextFeature.idx); 
      }     
    };

    $scope.backFeature = function(){
      var backIdx = $scope.idx - 1;

      if(backIdx > -1){
        var nextFeature = $scope.features[backIdx];
        $scope.selectFeature(nextFeature.template, nextFeature.idx);    
      }
    };

    $scope.homeClick = function(){
      var nextFeature = $scope.features[0];
      $scope.selectFeature(nextFeature, 0);
    };

  });