angular.module('instacafe.directives')
.directive('feedbackModal', function ($ionicModal) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.bind('click', function () {
                scope.showFeedbackModal();
            });

            $ionicModal.fromTemplateUrl('templates/modal/feedback.html', {
                'scope': scope
            }).then(function(modal) {
                scope.modal = modal;
            });

            scope.showFeedbackModal = function () {
                scope.modal.show();
            };

            scope.closeFeedbackModal = function () {
                scope.modal.hide();
            };

            scope.submit = function (message) {
                console.log(message);
                scope.closeFeedbackModal();
            };

            /* Destroy modal */
            scope.$on('$destroy', function() {
                scope.modal.remove();
            });
        }
    };
});
