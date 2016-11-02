(function() {
    'use strict';

    angular
        .module('app.shipt.search')
        .service('filterSortModal', filterSortModal);

    filterSortModal.$filterSortModal = [
        '$ionicModal',
        '$q'
    ];

    /* @ngInject */
    function filterSortModal(
        $ionicModal,
        $q) {

        var sortFilterModal = null;
        /**
         * @ngdoc function
         * @name show
         * @description function will return a promise and show the filter modal. Will resolve the promise when the modal is closed.
         *
         * @param $scope The scope that this modal will belong to.
         */
        this.show = function($scope) {
            var defer = $q.defer();
            $scope.closeModal = function(){
                closeModal();
                defer.resolve();
            };
            getModal($scope).then(function(modal){
                modal.show();
            });
            return defer.promise;
        };

        this.closeModal = function() {
            closeModal();
        };

        /**
         * @ngdoc function
         * @name getModal
         * @description Instantiates a new modal instance in the given scope.
         *
         * @param $scope The scope to which this modal belongs.
         * @returns {*} A promise resolving with the modal instance.
         */
        function getModal($scope) {
            var defer = $q.defer(),
                tpl = 'app/search/filterSort/modal/filterSortModal.html';
            $ionicModal.fromTemplateUrl(tpl, {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function(modal) {
                sortFilterModal = modal;
                defer.resolve(sortFilterModal);
            });
            return defer.promise;
        }

        /**
         * Handler for closing the modal.
         */
        function closeModal() {
            if (sortFilterModal) {
                sortFilterModal.hide();
            }
        }

    }
})();
