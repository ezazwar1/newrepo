angular.module('swMobileApp').controller('WorkoutCustomCtrl', function ($rootScope, $scope, $ionicModal, $location, $ionicLoading, $translate, $ionicPopup, $ionicListDelegate, $http, $ionicActionSheet, $ionicSlideBoxDelegate, $ionicScrollDelegate, $timeout, filterFilter, UserService, WorkoutService, AppSyncService, FirebaseService, AccessService, $ionicPlatform, $log, $q, swAnalytics, $window) {
    $log.info("WorkoutCustomCtrl()");
    var controller = this;
    LocalHistory.getCustomHistory.lastHomeURL = $location.$$url;

    AccessService.isPremiumUser()
        .then(function (isPremiumUser) {
            $scope.isPremiumCustomsUnlocked = isPremiumUser;
        });

    AccessService.getBasicAccess()
        .then(function (legacyBasicAccess) {
            $scope.isLegacyBasicAccessRestricted = legacyBasicAccess && (legacyBasicAccess >= 1);
            if ($scope.isLegacyBasicAccessRestricted) {
                $scope.numberOfAllowedCustomWorkouts = 1;
            }
            $log.info('$scope.isLegacyBasicAccessRestricted: ', $scope.isLegacyBasicAccessRestricted);
        });

    $scope.currentSelection = {};
    $scope.androidPlatform = ionic.Platform.isAndroid();
    $scope.browserPlatform = ionic.Platform.isWebView();
    if ($window.device) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    $scope.getFirst = function (phrase) {
        if (phrase) {
            return phrase.split(/[.!?]+/)[0].substring(0, 98) + '' || '';
        } else {
            return '';
        }
    };

    $scope.downloadedWorkouts = downloadableWorkouts;
    $scope.editMode = false;
    $scope.customName = '';
    $scope.currentCustom = UserService.getCurrentCustom();
    $scope.isPressed = false;
    $scope.needToDeleteOldest = false;
    $scope.numberOfAllowedCustomWorkouts = 3;
    $ionicPlatform.ready(function () {
        $scope.deviceBasePath = WorkoutService.getDownloadsDirectory();
        $log.debug("$scope.deviceBasePath", $scope.deviceBasePath);
    })
        .then(WorkoutService.getUserExercises)
        .then(function (userExercises) {
            controller.userExercises = userExercises;
            $scope.exerciseCategories = [
                {
                    shortName: "upper",
                    longName: "UPPER_SM",
                    exercises: WorkoutService.getExercisesByCategory(controller.userExercises, 'upper')
                },
                {
                    shortName: "core",
                    longName: "CORE_SM",
                    exercises: WorkoutService.getExercisesByCategory(controller.userExercises, 'core')
                },
                {
                    shortName: "lower",
                    longName: "LOWER_SM",
                    exercises: WorkoutService.getExercisesByCategory(controller.userExercises, 'lower')
                },
                {
                    shortName: "stretch",
                    longName: "STRETCH_SM",
                    exercises: WorkoutService.getExercisesByCategory(controller.userExercises, 'stretch')
                },
                {
                    shortName: "back",
                    longName: "BACK_SM",
                    exercises: WorkoutService.getExercisesByCategory(controller.userExercises, 'back')
                },
                {
                    shortName: "cardio",
                    longName: "CARDIO_SM",
                    exercises: WorkoutService.getExercisesByCategory(controller.userExercises, 'cardio')
                },
                {
                    shortName: "pilates",
                    longName: "PILATES_SM",
                    exercises: WorkoutService.getExercisesByCategory(controller.userExercises, 'pilates')
                },
                {
                    shortName: "yoga",
                    longName: "YOGA_SM",
                    exercises: WorkoutService.getExercisesByCategory(controller.userExercises, 'yoga')
                }
            ];
            $scope.allExercises = [];
            for (var eachExercise in userExercises) {
                if (controller.userExercises[eachExercise].category !== "hidden") {
                    $scope.allExercises.push($translate.instant(controller.userExercises[eachExercise].name));
                }
            }
            $timeout(function () {
                $scope.allExercises.sort();
            }, 1500)
        });

    // This is called from the HTML template custom-workouts-reorder.html
    $scope.getTranslatedExercise = function (exerciseName) {
        return $scope.possibleWorkouts[exerciseName].name;
    };
    $scope.addExercise = function () {
        if ($scope.selectedExerciseAdd.selected !== '') {
            var keyObject = translations[PersonalData.GetUserSettings.preferredLanguage];
            keyObject.getKeyByValue = function (value) {
                for (var prop in this) {
                    if (this.hasOwnProperty(prop)) {
                        if (this[prop] === value)
                            return prop;
                    }
                }
            };
            var foundKey = keyObject.getKeyByValue($scope.selectedExerciseAdd.selected);
            var keyInEN = translations['EN'][foundKey];
            $scope.reorderWorkout.push(keyInEN);
        }
    };
    $scope.selectedExerciseAdd = {selected: $translate.instant('ABDOMINALCRUNCH')};
    $scope.workoutLengths = function () {
        $scope.customWorkouts.savedWorkouts.forEach(function (element) {
            if (element.workout.length == 1) {
                element.total = "1 "
            } else {
                element.total = element.workout.length + ' '
            }
        });
    };
    $scope.editAll = function () {
        if ($scope.editMode) {
            angular.element(document.getElementsByClassName('my-customs')).removeClass('edit-mode');
            angular.element(document.getElementsByClassName('item-options')).addClass('invisible');
        }
        else {
            angular.element(document.getElementsByClassName('item-options')).removeClass('invisible');
            angular.element(document.getElementsByClassName('my-customs')).addClass('edit-mode');
        }
        $scope.editMode = !$scope.editMode;
    };
    $scope.shareCustom = function (indexEl, customObj) {
        var selectedWorkout = customObj;
        $ionicListDelegate.closeOptionButtons();
        var postURL = '';
        if (selectedWorkout.shareUrl) {
            postURL = 'http://sworkitapi.herokuapp.com/workouts?s=' + selectedWorkout.shareUrl;
        } else {
            postURL = 'http://sworkitapi.herokuapp.com/workouts';
        }
        $http({
            url: postURL,
            method: "POST",
            data: JSON.stringify({name: selectedWorkout.name, exercises: selectedWorkout.workout}),
            headers: {'Content-Type': 'application/json'}
        })
            .then(function (resp) {
                selectedWorkout.shareUrl = resp.data.shortURI;
                //TODO: Update this URL with swork.it
                var shareDeliveryUrl = 'http://m.sworkit.com/share?w=' + resp.data.shortURI;
                var customMessage = $translate.instant('TRY_WORKOUT') + ', ' + resp.data.name + '. ' + $translate.instant('GET_IT');
                if ($window.device) {
                    $window.plugins.socialsharing.share(customMessage, "Sworkit Workout", null, shareDeliveryUrl,
                        function sucessCallback() {
                            swAnalytics.trackEvent('kpi', 'referral', 'workout-custom-send');
                            FiksuTrackingManager.uploadPurchase(FiksuTrackingManager.PurchaseEvent.Event4, 0, "USD");
                            logActionSessionM('ShareCustomWorkout');
                        },
                        function errorCallback(err) {
                            $log.error("Unable to share custom workout", err);
                        });
                } else {
                    $log.debug('Shared ' + resp.data.name + ': http://m.sworkit.com/share?w=' + resp.data.shortURI);
                }
            })
            .catch(function () {
                $window.navigator.notification.alert(
                    $translate.instant('PLEASE_RETRY'),  // message
                    nullHandler,         // callback
                    $translate.instant('SHARE_FAIL'),            // title
                    $translate.instant('OK')                  // buttonName
                );
            });
    };
    $scope.deleteCustom = function (indexEl, customObj) {
        var confirmDelete = $translate.instant('DELETE') + ' ' + customObj.name + '?';
        if ($window.device) {
            $window.navigator.notification.confirm(
                '',
                function (buttonIndex) {
                    if (buttonIndex !== 2) {
                        doDeleteCustom();
                        $ionicListDelegate.closeOptionButtons();
                    }
                },
                confirmDelete,
                [$translate.instant('OK'), $translate.instant('CANCEL_SM')]
            );
        } else {
            doDeleteCustom();
            $ionicListDelegate.closeOptionButtons();
        }

        function doDeleteCustom() {
            $timeout(function () {
                $scope.customWorkouts.savedWorkouts.splice($scope.customWorkouts.savedWorkouts.indexOf(customObj), 1);
            });
            var syncId = customObj.$id || false;
            $log.debug("Deleting workout with syncId", syncId);
            localforage.setItem('customWorkouts', PersonalData.GetCustomWorkouts);
            if (FirebaseService.authData) {
                if (syncId) {
                    AppSyncService.remoteDeleteFromLocalForageCustomWorkouts(syncId);
                }
            }
        }

    };
    $scope.editCustom = function (indexEl, customObj) {
        var buttonOptions = [];
        var templateOption = '';
        if ($scope.isPremiumCustomsUnlocked) {
            buttonOptions = [
                {text: '<b>' + $translate.instant("ADD_REMOVE") + '</b>'},
                {text: $translate.instant("CHANGE_ORDER")},
                {text: $translate.instant("RENAME_WORKOUT")}
            ];
            templateOption = '<div class="action-button" style="padding-bottom:10px"><button class="button button-full button-stable" ng-click="actionButtonClicked(0)">{{"ADD_REMOVE" | translate}}</button><button class="button button-full button-stable" ng-click="actionButtonClicked(1)">{{"CHANGE_ORDER" | translate}}</button><button class="button button-full button-stable" ng-click="actionButtonClicked(2)">{{"RENAME_WORKOUT" | translate}}</button><button class="button button-full button-stable" ng-click="actionCancel()" style="text-align:center;padding-left:0;margin-bottom:-10px">{{"CANCEL_SM" | translate}}</button></div>'
        } else {
            buttonOptions = [
                {text: '<b>' + $translate.instant("ADD_REMOVE") + '</b>'},
                {text: $translate.instant("RENAME_WORKOUT")}
            ];
            templateOption = '<div class="action-button" style="padding-bottom:10px"><button class="button button-full button-stable" ng-click="actionButtonClicked(0)">{{"ADD_REMOVE" | translate}}</button><button class="button button-full button-stable" ng-click="actionButtonClicked(2)">{{"RENAME_WORKOUT" | translate}}</button><button class="button button-full button-stable" ng-click="actionCancel()" style="text-align:center;padding-left:0;margin-bottom:-10px">{{"CANCEL_SM" | translate}}</button></div>'
        }

        if ($window.device && $window.device.platform.toLowerCase() == 'ios') {
            $timeout(function () {
                $ionicActionSheet.show({
                    buttons: buttonOptions,
                    titleText: $translate.instant("EDIT_CUSTOM"),
                    cancelText: $translate.instant("CANCEL_SM"),
                    buttonClicked: function (indexNum) {
                        $scope.actionButtonClicked(indexNum);
                        return true;
                    },
                    cancel: function (indexNum) {
                        $scope.actionCancel(indexNum);
                        return true;
                    }
                });
                $scope.actionPopup = {
                    close: function () {
                    }
                }
            }, 800);
        } else {
            $scope.actionPopup = $ionicPopup.show({
                title: $translate.instant('EDIT_CUSTOM'),
                subTitle: '',
                scope: $scope,
                template: templateOption
            });
            $timeout(function () {
                angular.element(document.getElementsByTagName('body')[0]).addClass('popup-open');
            }, 500)
        }
        $scope.actionButtonClicked = function (indexNum) {
            var selectedItem = customObj;
            if (indexNum == 0) {
                $scope.currentCustom = selectedItem.workout;
                $scope.editMode = true;
                $scope.customName = selectedItem.name;
                $scope.createCustom();
                $scope.actionPopup.close();
            } else if (indexNum == 1 && $scope.isPremiumCustomsUnlocked) {
                $scope.customName = selectedItem.name;
                $scope.reorderCustom(selectedItem);
                $scope.actionPopup.close();
            } else if (indexNum == 1 || indexNum == 2) {
                $ionicPopup.prompt({
                    title: $translate.instant('NEW_NAME'),
                    cancelText: $translate.instant('CANCEL_SM'),
                    inputType: 'text',
                    template: '<input ng-model="data.response" type="text" autofocus class="ng-pristine ng-valid">',
                    inputPlaceholder: selectedItem.name,
                    okText: $translate.instant('SAVE'),
                    okType: 'energized'
                })
                    .then(function (res) {
                        if (res && res.length > 1) {
                            selectedItem.name = res;
                            if (selectedItem.sync_lastUpdated) {
                                var currentTime = new Date();
                                selectedItem.sync_lastUpdated = currentTime.getTime();
                                AppSyncService.updateToSyncLogLocal(selectedItem.$id, selectedItem.sync_lastUpdated);
                            } else {
                                localforage.setItem('customWorkouts', PersonalData.GetCustomWorkouts);
                            }
                        }
                        $scope.actionPopup.close();
                    });
            }
            $ionicListDelegate.closeOptionButtons();
        };
        $scope.actionCancel = function () {
            $ionicListDelegate.closeOptionButtons();
            $scope.actionPopup.close();
        };
        $scope.actionDestructiveButtonClicked = function () {
            var selectedItem = customObj;
            $scope.customWorkouts.savedWorkouts.forEach(function (element, index) {
                if (element.name == selectedItem.name) {
                    $scope.customWorkouts.savedWorkouts.splice(index, 1);
                    PersonalData.GetCustomWorkouts = $scope.customWorkouts;
                    localforage.setItem('customWorkouts', PersonalData.GetCustomWorkouts);
                }
            });
            $ionicListDelegate.closeOptionButtons();
            $scope.actionPopup.close();
        }
    };
    $scope.createCustom = function () {
        if (!$scope.editMode && PersonalData.GetCustomWorkouts.savedWorkouts.length >= $scope.numberOfAllowedCustomWorkouts && !$scope.isPremiumCustomsUnlocked) {
            $ionicPopup.confirm({
                title: $translate.instant("CREATE_W"),
                template: '<p class="padding">' + $translate.instant("REPLACE_CUSTOM") + '<a>' + $translate.instant("WANT_UPGRADE") + '</a></p>',
                okType: 'premium-blue-primary',
                okText: $translate.instant('OK'),
                cancelText: $translate.instant('CANCEL_SM'),
                cancelType: 'premium-blue-secondary-clear',
                cssClass: 'replace-custom-popup'
            })
                .then(function (res) {
                    if (res) {
                        $scope.needToDeleteOldest = true;
                        $scope.createCustomOpen();
                    }
                });
        } else {
            $ionicLoading.show({
                template: $translate.instant('GATHERING'),
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                duration: 5000
            });
            $timeout(function () {
                $scope.createCustomOpen();
            }, 500);
        }

    };
    $scope.createCustomOpen = function () {
        $ionicModal.fromTemplateUrl('components/custom-workouts/custom-workouts-create.html', function (modal) {
            $scope.customModal = modal;
        }, {
            scope: $scope,
            animation: 'fade-implode',
            focusFirstInput: false,
            backdropClickToClose: false,
            hardwareBackButtonClose: false
        });
        $timeout(function () {
            $scope.openCreateCustom();
        }, 100);
        $scope.openCreateCustom = function () {
            $scope.customModal.show();
        };
        $scope.cancelCreateCustom = function () {
            $scope.needToDeleteOldest = false;
            $scope.customModal.hide();
            $scope.editMode = false;
            $scope.currentCustom = UserService.getCurrentCustom();
            $scope.selectedExercises()
                .then(function (selectedExercises) {
                    PersonalData.GetWorkoutArray.workoutArray = selectedExercises;
                    $timeout(function () {
                        $scope.customModal.remove();
                    }, 1000);
                });
        };
        $scope.resetCustom = function () {
            if ($window.device) {
                $window.navigator.notification.confirm(
                    $translate.instant('CLEAR_SELECTIONS'),
                    function (buttonIndex) {
                        if (buttonIndex == 2) {
                            angular.forEach(controller.userExercises, function (value) {
                                $scope.currentSelection[value.name] = false;
                            });
                            $scope.totalSelected = 0;
                            PersonalData.GetWorkoutArray.workoutArray = [];
                            $scope.$apply();
                        }
                    },
                    $translate.instant('RESET_CUSTOM'),
                    [$translate.instant('CANCEL_SM'), $translate.instant('OK')]
                );
            } else {
                $ionicPopup.confirm({
                    title: $translate.instant('RESET_CUSTOM'),
                    template: '<p class="padding">' + $translate.instant("CLEAR_SELECTIONS") + '</p>',
                    okType: 'energized',
                    okText: $translate.instant('OK'),
                    cancelText: $translate.instant('CANCEL_SM')
                })
                    .then(function (res) {
                        if (res) {
                            angular.forEach(controller.userExercises, function (value) {
                                $scope.currentSelection[value.name] = false;
                            });
                            PersonalData.GetWorkoutArray.workoutArray = [];
                        }
                    });
            }
        };

        angular.forEach(controller.userExercises, function (value) {
            $scope.currentSelection[value.name] = false;
        });
        $scope.currentCustom.forEach(function (element, index) {
            if (controller.userExercises[element]) {
                $scope.currentSelection[controller.userExercises[element].name] = true
            } else {
                $scope.currentCustom.splice(index, 1);
                index--;
            }
        });

        $scope.selectedExercises = function () {
            var deferred = $q.defer();

            var arrUse = [];
            angular.forEach($scope.currentSelection, function (value, key) {
                if (value) {
                    arrUse.push(translations['EN'][key]);
                }
            });
            deferred.resolve(arrUse);
            return deferred.promise;
        };

        $scope.setTotalSelectedExercises = function () {
            $scope.selectedExercises()
                .then(function (selectedExercises) {
                    $scope.totalSelected = selectedExercises.length;
                });
        };

        $scope.setTotalSelectedExercises();

        $scope.mathSelected = function (addSubtract) {
            if (addSubtract) {
                $scope.totalSelected++;
            } else {
                $scope.totalSelected--;
            }
        };
        $timeout(function () {
            $ionicLoading.hide();
        }, 1000);
        $timeout(function () {
            angular.element(document.getElementsByTagName('body')[0]).removeClass('loading-active');
            $ionicLoading.hide();
        }, 6000);
        $scope.searchTyping = function (typedthings) {

        };
        $scope.searchSelect = function (suggestion) {
            $scope.slideTo($scope.allExercises.indexOf(suggestion), suggestion);
        };
        $scope.slideTo = function (location, suggestion) {
            var newLocation = $location.hash(location);
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
            $scope.currentSelection[foundKey] = true;
            $timeout(function () {
                $ionicScrollDelegate.$getByHandle('createScroll').anchorScroll("#" + newLocation);
                $scope.setTotalSelectedExercises();
            }, 50);
        };
    };
    $scope.toggleAll = function (shortCat, indexN) {
        var indexID = angular.element(document.getElementById('cat' + indexN));
        indexID.toggleClass('group-active');
        if (indexID.hasClass('group-active')) {
            $scope.exerciseCategories[indexN].exercises.forEach(function (element) {
                $scope.currentSelection[element.name] = true
            });
        } else {
            $scope.exerciseCategories[indexN].exercises.forEach(function (element) {
                $scope.currentSelection[element.name] = false
            });
        }
        $scope.setTotalSelectedExercises();
    };
    $scope.saveCustom = function () {
        $scope.selectedExercises()
            .then(function (selectedExercisesForCustom) {
                PersonalData.GetWorkoutArray.workoutArray = selectedExercisesForCustom;
                localforage.setItem('currentCustomArray', PersonalData.GetWorkoutArray);
                if ($scope.editMode) {
                    var fillTitle = $translate.instant('SAVE_CHANGE') + '  ' + $scope.customName + '?';
                    if ($window.device) {
                        $window.navigator.notification.confirm(
                            '',
                            function (buttonIndex) {
                                if (buttonIndex == 2 && selectedExercisesForCustom.length > 0) {
                                    $scope.customWorkouts.savedWorkouts.forEach(function (element) {
                                        if (element.name == $scope.customName) {
                                            element.workout = selectedExercisesForCustom;
                                            PersonalData.GetCustomWorkouts = $scope.customWorkouts;
                                            if (element.sync_lastUpdated) {
                                                var currentTime = new Date();
                                                element.sync_lastUpdated = currentTime.getTime();
                                                localforage.setItem('customWorkouts', PersonalData.GetCustomWorkouts)
                                                    .then(function () {
                                                        AppSyncService.updateToSyncLogLocal(element.$id, element.sync_lastUpdated);
                                                    });
                                            } else {
                                                localforage.setItem('customWorkouts', PersonalData.GetCustomWorkouts);
                                            }
                                        }
                                    });
                                    $scope.editMode = false;
                                    $scope.currentCustom = UserService.getCurrentCustom();
                                    $scope.customModal.hide();
                                    $scope.workoutLengths();
                                    $timeout(function () {
                                        $scope.customModal.remove();
                                    }, 1000);
                                }
                            },
                            fillTitle,
                            [$translate.instant('CANCEL_SM'), $translate.instant('OK')]
                        );
                    } else {
                        $ionicPopup.confirm({
                            title: fillTitle,
                            template: '',
                            okType: 'energized',
                            okText: $translate.instant('OK'),
                            cancelText: $translate.instant('CANCEL_SM')
                        })
                            .then(function (res) {
                                if (res && selectedExercisesForCustom.length > 0) {
                                    if (selectedExercisesForCustom.sync_lastUpdated) {
                                        var currentTime = new Date();
                                        selectedExercisesForCustom.sync_lastUpdated = currentTime.getTime();
                                    }
                                    $scope.customWorkouts.savedWorkouts.forEach(function (element) {
                                        if (element.name == $scope.customName) {
                                            element.workout = selectedExercisesForCustom;
                                            PersonalData.GetCustomWorkouts = $scope.customWorkouts;
                                            if (element.sync_lastUpdated) {
                                                var currentTime = new Date();
                                                element.sync_lastUpdated = currentTime.getTime();
                                                localforage.setItem('customWorkouts', PersonalData.GetCustomWorkouts)
                                                    .then(function () {
                                                        AppSyncService.updateToSyncLogLocal(element.$id, element.sync_lastUpdated);
                                                    });
                                            } else {
                                                localforage.setItem('customWorkouts', PersonalData.GetCustomWorkouts);
                                            }
                                        }
                                    });
                                    $scope.editMode = false;
                                    $scope.currentCustom = UserService.getCurrentCustom();
                                    $scope.customModal.hide();
                                    $scope.workoutLengths();
                                    $timeout(function () {
                                        $scope.customModal.remove();
                                    }, 1000);
                                }
                            });
                    }
                } else {
                    $ionicPopup.prompt({
                        title: $translate.instant('NAME_THIS'),
                        text: $translate.instant('REPLACE_CUSTOM'),
                        cancelText: $translate.instant('CANCEL_SM'),
                        inputType: 'text',
                        template: '<input ng-model="data.response" type="text" autofocus class="ng-pristine ng-valid">',
                        inputPlaceholder: 'name',
                        okText: $translate.instant('SAVE'),
                        okType: 'energized'
                    })
                        .then(function (res) {
                            if (res && res.length > 1 && selectedExercisesForCustom.length > 0) {
                                if ($scope.needToDeleteOldest) {
                                    var syncId = PersonalData.GetCustomWorkouts.savedWorkouts[0].$id || false;
                                    PersonalData.GetCustomWorkouts.savedWorkouts.splice(0, 1);
                                }
                                $scope.customWorkouts.savedWorkouts.push({
                                    "name": res,
                                    "workout": selectedExercisesForCustom
                                });

                                if (!$scope.editMode && $window.device) {
                                    logActionSessionM('DesignCustomWorkout');
                                    FiksuTrackingManager.uploadPurchase(FiksuTrackingManager.PurchaseEvent.Event3, 0, "USD");
                                }
                                PersonalData.GetCustomWorkouts = $scope.customWorkouts;
                                localforage.setItem('customWorkouts', PersonalData.GetCustomWorkouts);
                                if ($scope.needToDeleteOldest) {
                                    if (FirebaseService.authData) {
                                        if (syncId) {
                                            AppSyncService.remoteDeleteFromLocalForageCustomWorkouts(syncId);
                                        }
                                    }
                                    $scope.needToDeleteOldest = false;
                                }
                                $scope.editMode = false;
                                $scope.currentCustom = UserService.getCurrentCustom();
                                $scope.customModal.hide();
                                $scope.workoutLengths();
                                $timeout(function () {
                                    $scope.customModal.remove();
                                }, 1000);
                            }
                        });
                }
            });
    };

    $scope.previewCustom = function () {
        angular.element(document.getElementsByTagName('body')[0]).addClass('preview-popup');
        $scope.selectedExercises()
            .then(function (selectedExercisesForCustom) {
                $scope.currentlySelectedExercises = selectedExercisesForCustom;
                $ionicPopup.alert({
                    title: $translate.instant('SELECTED'),
                    scope: $scope,
                    template: '<div class="selected-exercises"><p class="item" ng-repeat="selExercise in currentlySelectedExercises">{{selExercise | translate}}</p></div>',
                    okType: 'energized',
                    okText: $translate.instant('OK')
                })
                    .then(function () {
                        angular.element(document.getElementsByTagName('body')[0]).removeClass('preview-popup');
                    });
            })
    };

    $scope.reorderCustom = function (passedWorkout) {
        $scope.passedWorkoutSave = passedWorkout;
        WorkoutService.getUserExercises()
            .then(function (userExercises) {
                $scope.possibleWorkouts = userExercises;
                $scope.openReorderCustom2();
            });
        $ionicModal.fromTemplateUrl('components/custom-workouts/custom-workouts-reorder.html', function (modal) {
            $scope.customModal2 = modal;
        }, {
            scope: $scope,
            animation: 'fade-implode',
            focusFirstInput: false,
            backdropClickToClose: false,
            hardwareBackButtonClose: false
        });

        $scope.reorderWorkout = passedWorkout.workout;
        $scope.data = {showReorder: true, showDelete: false};
        $scope.moveItem = function (item, fromIndex, toIndex) {
            $scope.reorderWorkout.splice(fromIndex, 1);
            $scope.reorderWorkout.splice(toIndex, 0, item);
        };
        $scope.onItemDelete = function (item) {
            $scope.reorderWorkout.splice($scope.reorderWorkout.indexOf(item), 1);
        };
        $scope.openReorderCustom2 = function () {
            $scope.customModal2.show();
        };
        $scope.cancelReorderCustom = function () {
            $scope.customModal2.hide();
            $scope.editMode = false;
            $timeout(function () {
                $scope.customModal2.remove();
            }, 1000);
        };
        $scope.saveReorder = function () {
            var fillTitle = $translate.instant('SAVE_CHANGE') + '  ' + $scope.customName + '?';
            if ($window.device) {
                $window.navigator.notification.confirm(
                    '',
                    function (buttonIndex) {
                        if (buttonIndex == 2) {
                            $scope.customWorkouts.savedWorkouts.forEach(function (element) {
                                if (element.name == $scope.passedWorkoutSave.name) {
                                    element.workout = $scope.passedWorkoutSave.workout;
                                    if (element.sync_lastUpdated) {
                                        var currentTime = new Date();
                                        element.sync_lastUpdated = currentTime.getTime();
                                        localforage.setItem('customWorkouts', PersonalData.GetCustomWorkouts)
                                            .then(function () {
                                                AppSyncService.updateToSyncLogLocal(element.$id, element.sync_lastUpdated);
                                            });
                                    } else {
                                        PersonalData.GetCustomWorkouts = $scope.customWorkouts;
                                        localforage.setItem('customWorkouts', PersonalData.GetCustomWorkouts);
                                    }
                                }
                            });
                            $scope.editMode = false;
                            $scope.customModal2.hide();
                            $timeout(function () {
                                $scope.customModal2.remove();
                            }, 1000);
                            $scope.workoutLengths();
                        }
                    },
                    fillTitle,
                    [$translate.instant('CANCEL_SM'), $translate.instant('OK')]
                );
            } else {
                $ionicPopup.confirm({
                    title: fillTitle,
                    template: '',
                    okType: 'energized',
                    okText: $translate.instant('OK'),
                    cancelText: $translate.instant('CANCEL_SM')
                })
                    .then(function (res) {
                        if (res) {
                            $scope.customWorkouts.savedWorkouts.forEach(function (element) {
                                if (element.name == $scope.passedWorkoutSave.name) {
                                    element.workout = $scope.passedWorkoutSave.workout;
                                    PersonalData.GetCustomWorkouts = $scope.customWorkouts;
                                    if (element.sync_lastUpdated) {
                                        var currentTime = new Date();
                                        element.sync_lastUpdated = currentTime.getTime();
                                        localforage.setItem('customWorkouts', PersonalData.GetCustomWorkouts)
                                            .then(function () {
                                                AppSyncService.updateToSyncLogLocal(element.$id, element.sync_lastUpdated);
                                            });
                                    } else {
                                        localforage.setItem('customWorkouts', PersonalData.GetCustomWorkouts);
                                    }
                                }
                            });
                            $scope.editMode = false;
                            $scope.customModal2.hide();
                            $scope.workoutLengths();
                        }
                    });
            }
        };
        if ($window.device) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false)
        }
        $scope.$on('$ionicView.leave', function () {
            if ($window.device) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true)
            }
        });
    };

    $scope.selectCustom = function (indexEl, selectedCustom) {
        LocalData.GetWorkoutTypes.customWorkout = {
            id: 100,
            activityWeight: 6,
            activityMFP: "134026252709869",
            activityNames: selectedCustom.name,
            exercises: selectedCustom.workout,
            customData: selectedCustom,
            googleActivity: selectedCustom.googleActivity || "Custom Workout",
            appleActivityHK: selectedCustom.appleActivityHK || "HKWorkoutActivityTypeCrossTraining",
            humanAPIActivity: selectedCustom.humanAPIActivity || "circuit_training"
        };
        $location.path('/app/home/2/customWorkout');
    };

    $scope.addCustomWorkout = function (workid, index) {
        var selectWorkout;
        $scope.downloadedWorkouts.forEach(function (element) {
            if (element.shortURI == workid) {
                selectWorkout = element
            }
        });
        if (PersonalData.GetCustomWorkouts.savedWorkouts.length < $scope.numberOfAllowedCustomWorkouts || $scope.isPremiumCustomsUnlocked) {
            $timeout(function () {
                angular.element(document.getElementById('item' + index)).removeClass('ion-checkmark').addClass('ion-plus');
            }, 3000);
            $scope.customWorkouts.savedWorkouts.push({
                "name": selectWorkout.name,
                "workout": selectWorkout.exercises
            });
            PersonalData.GetCustomWorkouts = $scope.customWorkouts;
            localforage.setItem('customWorkouts', PersonalData.GetCustomWorkouts);
            trackEvent('Download Custom', selectWorkout.name, 0);
            $scope.workoutLengths();
        } else {
            var upgradePopup = $ionicPopup.confirm({
                title: $translate.instant("INSTALL"),
                template: '<p class="padding">' + $translate.instant("REPLACE_CUSTOM") + '<a ng-click="upgradeToPremium()">' + $translate.instant("WANT_UPGRADE") + '</a></p>',
                okType: 'premium-blue-primary',
                okText: $translate.instant('OK_INSTALL'),
                cancelText: $translate.instant('CANCEL_SM'),
                cancelType: 'premium-blue-secondary-clear',
                cssClass: 'replace-custom-popup',
                scope: $scope
            });

            upgradePopup.then(function (res) {
                if (res) {
                    $timeout(function () {
                        angular.element(document.getElementById('item' + index)).removeClass('ion-checkmark').addClass('ion-plus');
                    }, 3000);
                    var syncId = $scope.customWorkouts.savedWorkouts[0].$id || false;
                    $scope.customWorkouts.savedWorkouts.splice(0, 1);
                    $scope.customWorkouts.savedWorkouts.push({
                        "name": selectWorkout.name,
                        "workout": selectWorkout.exercises
                    });
                    PersonalData.GetCustomWorkouts = $scope.customWorkouts;
                    localforage.setItem('customWorkouts', PersonalData.GetCustomWorkouts);
                    if (FirebaseService.authData) {
                        if (syncId) {
                            AppSyncService.remoteDeleteFromLocalForageCustomWorkouts(syncId);
                        }
                    }
                    trackEvent('Download Custom', selectWorkout.name, 0);
                    $scope.workoutLengths();
                }
            });

            $scope.upgradeToPremium = function () {
                upgradePopup.close();
                $rootScope.showPremium('unlimited custom');
            };
        }
        if ($window.device) {
            FiksuTrackingManager.uploadPurchase(FiksuTrackingManager.PurchaseEvent.Event3, 0, "USD");
        }
    };
    $scope.updateDownloads = function () {
        getDownloadableWorkouts($http, true, $scope.optionSelected.ListType);
        $timeout(function () {
            $scope.$apply();
        }, 3000)
    };
    $scope.showFeatured = function () {
        $location.path('/app/custom/featured');
    };
    $scope.orPressed = function () {
        $scope.isPressed = true;
        $timeout(function () {
            $scope.isPressed = false;
        }, 1000);
    };
    $scope.$on('$ionicView.leave', function () {
        if ($window.device) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
        }
        $window.justAddedAWorkout = false;
        $ionicSlideBoxDelegate.update();
        localforage.setItem('customWorkouts', PersonalData.GetCustomWorkouts)
            .then(function () {
                AppSyncService.syncLocalForageCustomWorkouts();
            })
    });
    $scope.$on('$ionicView.beforeEnter', function () {
        $ionicSlideBoxDelegate.update();
        $scope.customWorkouts = UserService.getCustomWorkoutList();
        $scope.workoutLengths();
        if ($window.justAddedAWorkout) {
            $scope.hightlightLastWorkoutAsAdded = true;
            $timeout(function () {
                $scope.hightlightLastWorkoutAsAdded = false;
            }, 3000);
        }
    });
});
