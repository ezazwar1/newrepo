angular.module('swMobileApp').factory('WorkoutPreviewService', function ($rootScope, WorkoutService, $ionicPopup, $ionicPlatform, swAnalytics, $window, $log) {
    $log.info("WorkoutPreviewService");
    
    var WorkoutPreviewService = {};
    var popupScope = $rootScope.$new();

    $ionicPlatform.ready(function () {
        popupScope.deviceBasePath = WorkoutService.getDownloadsDirectory();
    });

    popupScope.init = function () {
        WorkoutService.getUserExercises()
            .then(function (userExercises) {
                popupScope.userExercises = userExercises;
            });

        WorkoutService.getAllExercises()
            .then(function (allExercises) {
                popupScope.allExercises = allExercises;
            });
        popupScope.isAndroid = ionic.Platform.isAndroid();
    };

    WorkoutPreviewService.show = function (selectedWorkout) {
        swAnalytics.trackView('workout-preview');
        popupScope.previewSelectedWorkout = selectedWorkout;
        var workoutPreviewPopupOptions = {
            templateUrl: 'components/workout/workout-preview-popup.html',
            title: selectedWorkout.name,
            cssClass: ['low-impact-preview', 'preview-exercises-popup'],
            buttons: [
                {text: '<b>Cancel</b>'}
            ],
            scope: popupScope
        };
        $ionicPopup.show(workoutPreviewPopupOptions);
    };

    popupScope.init();

    return WorkoutPreviewService;

});
