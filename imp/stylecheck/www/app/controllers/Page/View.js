/*global define*/
define([
    'app',
    'services/page',
    'services/browse',
    'services/user'
], function (app) {

    'use strict';

    app.controller('PageCtrl', [
        '$scope',
        '$ionicHistory',
        'pageService',
        'browseService',
        'userService',
        function ($scope, $ionicHistory, pageService, browseService, userService) {
            var stateParams,
                language;

            function getPage() {
                pageService.get(stateParams.type, userService.user.language).then(function (page) {
                    $scope.page = page;

                    // show report and favorite style icon on faq page
                    if ($scope.page[0].type === 'faq') {
                        $scope.page[0].textToShow = $scope.page[0].text.replace('{{heart}}', '<i class="icon icon-favorite"></i>');
                        $scope.page[0].textToShow = $scope.page[0].textToShow.replace('{{report}}', '<i class="icon icon-report"></i>');
                    } else {
                        $scope.page[0].textToShow = $scope.page[0].text;
                    }

                });
            }

            $scope.back = function () {
                $ionicHistory.goBack();
            };

            // everytime when view entered
            $scope.$on('$ionicView.enter', function () {
                // check if first call or type !== last, or language has changed
                if (!stateParams || !stateParams.type || (stateParams.type !== browseService.params().type) || language !== userService.user.language) {
                    stateParams = browseService.params();
                    language = userService.user.language;
                    $scope.page = [];
                    getPage();
                }
            });
        }
    ]);
});
