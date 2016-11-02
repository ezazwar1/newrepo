angular.module('swMobileApp').controller('ExerciseListCtrl', function ($scope, $ionicModal, $ionicLoading, $http, $sce, $timeout, $translate, $location, $ionicScrollDelegate, WorkoutService, $ionicPlatform) {
    $ionicPlatform.ready(function () {
            $ionicLoading.show({
                template: $translate.instant('GATHERING'),
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                duration: 5000
            });
            $scope.deviceBasePath = WorkoutService.getDownloadsDirectory();
        })
        .then(WorkoutService.getUserExercises)
        .then(function (userExercises) {
            $ionicLoading.hide();
            $scope.exerciseCategories = [
                {
                    shortName: "upper",
                    longName: "UPPER_SM",
                    exercises: WorkoutService.getExercisesByCategory(userExercises, 'upper')
                },
                {
                    shortName: "core",
                    longName: "CORE_SM",
                    exercises: WorkoutService.getExercisesByCategory(userExercises, 'core')
                },
                {
                    shortName: "lower",
                    longName: "LOWER_SM",
                    exercises: WorkoutService.getExercisesByCategory(userExercises, 'lower')
                },
                {
                    shortName: "stretch",
                    longName: "STRETCH_SM",
                    exercises: WorkoutService.getExercisesByCategory(userExercises, 'stretch')
                },
                {
                    shortName: "back",
                    longName: "BACK_SM",
                    exercises: WorkoutService.getExercisesByCategory(userExercises, 'back')
                },
                {
                    shortName: "cardio",
                    longName: "CARDIO_SM",
                    exercises: WorkoutService.getExercisesByCategory(userExercises, 'cardio')
                },
                {
                    shortName: "pilates",
                    longName: "PILATES_SM",
                    exercises: WorkoutService.getExercisesByCategory(userExercises, 'pilates')
                },
                {
                    shortName: "yoga",
                    longName: "YOGA_SM",
                    exercises: WorkoutService.getExercisesByCategory(userExercises, 'yoga')
                }
            ];
            $scope.androidPlatform = ionic.Platform.isAndroid();
            $scope.advancedTiming = WorkoutService.getTimingIntervals();
            $scope.showVideo = false;
            if (device) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            $scope.currentExercise = userExercises['Squats'];
            $scope.allExercises = [];
            for (var eachExercise in userExercises) {
                $scope.allExercises.push($translate.instant(userExercises[eachExercise].name));
            }
            $timeout(function () {
                $scope.allExercises.sort();
            }, 1500);
        });

    $scope.getVideoLocation = function () {
        if ($scope.currentExercise.unlocked) {
            return $scope.deviceBasePath + 'exercises/video/';
        } else {
            return 'video/';
        }
    };

    $ionicModal.fromTemplateUrl('components/exercise-list/show-video-modal.html', function (modal) {
        $scope.videoModal = modal;
    }, {
        scope: $scope,
        animation: 'fade-implode',
        focusFirstInput: false,
        backdropClickToClose: false
    });
    $scope.openVideoModal = function (exerciseEl) {
        $scope.currentExercise = exerciseEl;
        $scope.videoModal.show();
        if ($scope.androidPlatform && device) {
            $timeout(function () {
                var videoPlayerFrame = angular.element(document.getElementById('videoplayerscreen'));
                videoPlayerFrame.css('opacity', '0.00001');
                videoPlayerFrame[0].src = 'http://m.sworkit.com/assets/exercises/Videos/' + $scope.currentExercise.video;

                videoPlayerFrame[0].addEventListener("timeupdate", function () {
                    if (videoPlayerFrame[0].duration > 0
                        && Math.round(videoPlayerFrame[0].duration) - Math.round(videoPlayerFrame[0].currentTime) == 0) {

                        //if loop atribute is set, restart video
                        if (videoPlayerFrame[0].loop) {
                            videoPlayerFrame[0].currentTime = 0;
                        }
                    }
                }, false);

                videoPlayerFrame[0].addEventListener("canplay", function () {
                    videoPlayerFrame[0].removeEventListener("canplay", this, false);
                    videoPlayerFrame[0].play();
                    videoPlayerFrame.css('opacity', '1');
                }, false);

                videoPlayerFrame[0].play();
            }, 100);
        } else {
            $scope.videoAddress = $scope.getVideoLocation() + $scope.currentExercise.video;
        }
        var calcHeight = (angular.element(document.getElementsByClassName('modal')).prop('offsetHeight')) * .7;
        calcHeight = calcHeight + 'px';
        // if (ionic.Platform.isAndroid() && !isKindle()){
        //   angular.element(document.querySelector('#videoplayer')).html("<video id='video2' poster='img/exercises/"+$scope.currentExercise.image+"' preload='auto' autoplay loop muted webkit-playsinline='webkit-playsinline' ><source src='"+$scope.videoData.videoURL+"'></source></video>");
        // }
        $scope.showVideo = true;

    };
    $scope.cancelVideoModal = function () {
        // if (ionic.Platform.isAndroid() && !isKindle()){
        //   angular.element(document.querySelector('#videoplayer')).html("");
        // }
        $scope.videoData = {youtubeURL: '', videoURL: ''};
        var videoPlayerFrame = angular.element(document.getElementById('videoplayerscreen'));
        if ($scope.androidPlatform) {
            videoPlayerFrame[0].src = '';
        }
        $scope.videoModal.hide();
    };

    $scope.searchTyping = function (typedthings) {

    };
    $scope.searchSelect = function (suggestion) {
        $scope.slideTo($scope.allExercises.indexOf(suggestion), suggestion);
    };
    $scope.slideTo = function (location, suggestion) {
        var newLocation = $location.hash(location);
        document.getElementById('exercise-search').value = '';
        var keyObject = translations[PersonalData.GetUserSettings.preferredLanguage];
        keyObject.getKeyByValue = function (value) {
            for (var prop in this) {
                if (this.hasOwnProperty(prop)) {
                    if (this[prop] === value)
                        return prop;
                }
            }
        };
        var foundKey = keyObject.getKeyByValue(suggestion);
        var keyInEN = translations['EN'][foundKey];
        $ionicScrollDelegate.$getByHandle('exerciseScroll').anchorScroll("#" + newLocation);
        WorkoutService.getUserExercises()
            .then(function (userExercises) {
                $timeout(function () {
                    $scope.openVideoModal(userExercises[keyInEN]);
                }, 500);
            });
    };

    $scope.$on('$ionicView.leave', function () {
        $scope.videoModal.remove();
        if (device) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
        }
    });
});
