myApp
.controller('IntroCtrl', function($scope, $state, Storage, $ionicPlatform, Profile, $timeout) {


    $scope.hideReturn();
    $scope.hideMenu();
    $scope.setPageEvent(false);
    $scope.initForm();

    $scope.user = {
        'firstname' : '',
        'lastname' : '',
        'email' : '',
        'password' : '',
        'profile' : '',
        'page' : ''
    };

    $scope.log = {
        'email' : '',
        'password' : ''
    };

    Profile.getTypes().then(function(resp){
        $scope.types = resp;
    });


    $scope.validStep1 = function(user){
        if( user.email === '' || user.password === '' || user.lastname === '' || user.firstname === '') {
            document.querySelector('.step1').classList.add('error');
        } else if (user.isInFashion) {
            $scope.step2 = true;
        } else {
            $scope.saveUser($scope.user);
        }
    };

    $scope.register = function(user){
        if(  user.profile === '') {
            document.querySelector('.step2').classList.add('error');
        } else {
            $scope.saveUser($scope.user);
        }
    };

    $scope.validLogin = function(log) {
        console.log(log);
        $scope.isLoading = true;
        $timeout( function(){
            $scope.isLoading = false;
        }, 3000);

        if ( log.email !== undefined && log.email !== '' && log.password !== '') {
            $scope.login(log);
        } else {
            $scope.isLoading = false;
            document.querySelector('#login').classList.add('error');
        }
    };

});
