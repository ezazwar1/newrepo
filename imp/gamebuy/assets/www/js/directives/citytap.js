var Citytap = angular.module('dir.citytap', []);

Citytap.directive('citytap', function($timeout) {
  return {
    link: function() {
      $timeout(function() {
        container = document.getElementsByClassName('pac-container');
        // disable ionic data tab
        angular.element(container).attr('data-tap-disabled', 'true');
        // leave input field if google-address-entry is selected
        angular.element(container).on("click", function(){
            document.getElementById('city-selector').blur();
        });
      },500);
    }
  };
});
