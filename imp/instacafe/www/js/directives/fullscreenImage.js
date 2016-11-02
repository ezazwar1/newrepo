angular.module('instacafe.directives')
.directive('fullscreenImage', function ($ionicModal) {
    return {
        restrict: 'A',
        scope: {
            photo: '='
        },
        link: function (scope, element, attrs) {
            element.bind('click', function () {
                scope.showFullscreenImageModal();
            });

            $ionicModal.fromTemplateUrl('templates/modal/fullscreenImage.html', {
                 'scope': scope
            }).then(function (modal) {
                scope.fullscreenImageModal = modal;
            });

            scope.showFullscreenImageModal = function () {
                scope.fullscreenImageModal.show();
            };

            scope.closeFullscreenImageModal = function () {
                scope.fullscreenImageModal.hide();
            };

            /* Destroy modal */
            scope.$on('$destroy', function() {
                scope.fullscreenImageModal.remove();
            });
        }
    };
});
