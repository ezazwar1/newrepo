angular.module('fun.controllers')

.factory('PetService', function () {

	var pets = [];

	for (var i=0; i<3000; i++) {
    pets[i] = {
      id: i,
      'firstName': 'Name' + i
    };

}

return {
    all: function () {
        return pets;
    },
    get: function (petId) {

        return pets[petId];
    }
};

})

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('master', {
      url: "/master",
      controller:'MasterCtrl',
      templateUrl: "master.html"
    })
  
  .state('detail', {
      url: "/detail/:petsId",
      controller:'DetailCtrl',
      templateUrl: "detail.html"
    });


   $urlRouterProvider.otherwise("/master");
})




.controller('MasterCtrl', function($scope, PetService, $ionicScrollDelegate) {
    
   $scope.pets = PetService.all();
  
 $scope.scrollBottom = function() {
    $ionicScrollDelegate.scrollBottom(true);
  };
  
  
})

.controller('DetailCtrl', function($scope, $stateParams, PetService) {
  
 $scope.pet = PetService.get($stateParams.petsId);

});