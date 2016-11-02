(function(angular){
    angular.element(document).ready(function() {
        if(window.cordova){
            document.addEventListener('deviceready', function() {
                angular.bootstrap(document.body, ["znk.sat"]);
            }, false);
        }
        else{
            var domElement = document.getElementsByTagName('body');
            angular.bootstrap(domElement, ["znk.sat"]);
        }
    });
})(angular);

