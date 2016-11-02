angular.module('swMobileApp').controller('BodyCtrl', function ($rootScope, $scope, $window, $http, $location, $timeout, $translate, $ionicLoading, $ionicSideMenuDelegate, $stateParams, $interval, $q, AppSyncService, AccessService, WorkoutService, $ionicHistory, $ionicPopup, $ionicModal, $ionicSlideBoxDelegate, FirebaseService, SyncService, IN_APP_PRODUCTS, InAppPurchase, $sce, swAnalytics, $log) {
    $log.info("BodyCtrl");

    $scope.init = function () {

        $window.childBrowserInstance = '';

        $ionicModal.fromTemplateUrl('components/premium/premium.html', {
            scope: $rootScope,
            animation: 'slide-in-up',
            backdropClickToClose: false
        })
            .then(function (modal) {
                $rootScope.premiumModal = modal;
            });

        $log.debug("BodyCtrl > check access, unlock, manage downloads...");
        AccessService.isGroupPro()
            .then(function (isGroupPro) {
                $log.debug("BodyCtrl > isGroupPro", isGroupPro);
                if (isGroupPro) {
                    $log.debug("Need to unlock for subscription...");
                    return WorkoutService.unlockForGroupPro();
                }
            })
            .then(WorkoutService.manageDownloads)
            .then(function (resolved) {
                $log.debug("BodyCtrl > manageDownloads() resolved", resolved);
            })
            .catch(function (rejected) {
                $log.warn("BodyCtrl > isGroupPro() or manageDownloads() rejected", rejected);
            });

        AccessService.getBasicAccess()
            .then(function (legacyBasicAccess) {
                $log.debug("BodyCtrl > getBasicAccess() resolved", legacyBasicAccess);
            })
            .catch(function (rejected) {
                $log.warn("BodyCtrl > getBasicAccess() rejected", rejected);
            });
    };

    $scope.callCustom = function (url) {
        var schemaParams = deparam(url);
        var isCurrentLocationWorkout = $location.$$url.slice(-7) === 'workout';
        if (schemaParams["workout"]) {
            if (schemaParams["discover"]) {
                swAnalytics.trackEvent('kpi', 'referral', 'workout-custom-discover-receive');
            } else {
                swAnalytics.trackEvent('kpi', 'referral', 'workout-custom-receive');
            }
            $ionicLoading.show({
                template: $translate.instant('IMPORTING')
            });
            var getUrl = 'http://sworkitapi.herokuapp.com/workouts?s=' + schemaParams["workout"] + '&d=true';
            $http.get(getUrl)
                .then(function (response) {
                    if (response.data.name) {
                        installWorkout(response.data.name, response.data.exercises, $location, $ionicSideMenuDelegate, $translate, AccessService, FirebaseService, AppSyncService, $rootScope, $ionicPopup, $timeout);
                        $timeout(function () {
                            $ionicLoading.hide();
                        }, 1000)
                    } else {
                        $ionicLoading.hide();
                        navigator.notification.alert(
                            $translate.instant('UNABLE'), // message
                            nullHandler, // callback
                            $translate.instant('INVALID'), // title
                            $translate.instant('OK') // buttonName
                        );
                    }
                })
                .catch(function (rejection) {
                    $log.warn("$http.get() workouts rejection", rejection);
                    $ionicLoading.hide();
                    navigator.notification.alert(
                        $translate.instant('UNABLE'), // message
                        nullHandler, // callback
                        $translate.instant('INVALID'), // title
                        $translate.instant('OK') // buttonName
                    );
                });
        }
        else if (schemaParams["custom"]) {
            if (!isCurrentLocationWorkout) {
                $location.path('/app/custom');
                $ionicSideMenuDelegate.toggleLeft(false);
            }
        }
        else if (schemaParams["access_code"]) {
            $ionicLoading.show({
                template: $translate.instant('AUTHORIZING')
            });
            myObj.code = schemaParams["access_code"];
            $timeout(function () {
                $ionicLoading.hide();
                if (!isCurrentLocationWorkout) {
                    $location.path('/app/settings');
                    setTimeout(function () {
                        $rootScope.childBrowserClosed()
                    }, 500);
                }
            }, 1000);

            if ($window.childBrowserInstance.close) {
                $window.childBrowserInstance.close();
            }
        }
        else if (schemaParams["mfperror"]) {
            console.log('mfperror: ' + schemaParams);
            $window.childBrowserInstance.close();
            $rootScope.childBrowserClosed();
        }
        else if (schemaParams["auth"] && schemaParams["auth"] === 'myfitnesspal') {
            if (!isCurrentLocationWorkout) {
                $location.path('/app/settings');
                $ionicSideMenuDelegate.toggleLeft(false);
            }
        }
        else if (schemaParams["premium"]) {
            if (!isCurrentLocationWorkout) {
                $rootScope.showPremium('urlschema');
            }
        } else if (schemaParams["discover"]) {
            if (!isCurrentLocationWorkout) {
                $location.path('/app/custom/featured');
                $ionicSideMenuDelegate.toggleLeft(false);
            }
        }
    };

    $scope.changeLanguage = function (langKey) {
        $translate.use(langKey);
    };

    $ionicModal.fromTemplateUrl('components/premium/premium.html', {
        scope: $rootScope,
        animation: 'slide-in-up',
        backdropClickToClose: false
    })
        .then(function (modal) {
            $rootScope.premiumModal = modal;
        });

    $rootScope.showPremium = function (userAction) {

        var premiumQuotes = [
            $translate.instant('PREMIUM_Q1'),
            $translate.instant('PREMIUM_Q2'),
            $translate.instant('PREMIUM_Q3')
        ];

        if (!_.isEmpty(globalSworkitAds.liveSubscriptionPurchases)) {
            $scope.monthlyPremiumProduct = globalSworkitAds.liveSubscriptionPurchases.monthly;
            $scope.annualPremiumProduct = globalSworkitAds.liveSubscriptionPurchases.annual;
        } else {
            $scope.monthlyPremiumProduct = IN_APP_PRODUCTS.MONTHLY_PREMIUM_2;
            $scope.annualPremiumProduct = IN_APP_PRODUCTS.ANNUAL_PREMIUM_2;
        }

        function getAction(lowerCaseAction) {
            switch (true) {
                case (lowerCaseAction.indexOf('onboarding') >= 0):
                    $rootScope.userInterest = 'onboarding';
                    break;
                case (lowerCaseAction.indexOf('ad-free') >= 0):
                    $rootScope.userInterest = 'ad-free';
                    break;
                case (lowerCaseAction.indexOf('exclusive') >= 0):
                    $rootScope.userInterest = 'exclusive';
                    break;
                case (lowerCaseAction.indexOf('trainer') >= 0):
                    $rootScope.userInterest = 'trainer';
                    break;
                case (lowerCaseAction.indexOf('low-impact') >= 0):
                    $rootScope.userInterest = 'low-impact';
                    break;
                case (lowerCaseAction.indexOf('intervals') >= 0):
                    $rootScope.userInterest = 'intervals';
                    break;
                case (lowerCaseAction.indexOf('custom') >= 0):
                    $rootScope.userInterest = 'custom';
                    break;
                case (lowerCaseAction.indexOf('side-menu') >= 0):
                    $rootScope.userInterest = 'general';
                    break;
                case (lowerCaseAction.indexOf('limited') >= 0):
                    $rootScope.userInterest = 'limited';
                    break;
                case (lowerCaseAction.indexOf('discover') >= 0):
                    $rootScope.userInterest = 'discover';
                    break;
                case (lowerCaseAction.indexOf('web-app') >= 0):
                    $rootScope.userInterest = 'web-app';
                    break;
                default:
                    $rootScope.userInterest = 'general';
            }
            SyncService.pushArray($rootScope.userInterest, 'premiumInterest');
        }

        getAction(userAction ? userAction.toLowerCase() : '');

        $log.info("User Interest:", $rootScope.userInterest);

        $scope.amazonProductRequestID = '';

        if (ionic.Platform.isWebView()) {

            if (isAmazon()) {
                var getProductDataResponseHandler = function (amazonIAP_Response) {
                    var amazonIAP_ResponseData = amazonIAP_Response.response;
                    console.log('Attempting to get Amazon Product Data');
                    if ($scope.amazonProductRequestID == amazonIAP_ResponseData.requestId) {
                        switch (amazonIAP_ResponseData.status) {
                            case 'SUCCESSFUL':
                                var requestedAmazonProducts = amazonIAP_ResponseData.productDataMap;
                                console.log('Success Getting Amazon Product Data');
                                $timeout(function () {
                                    $rootScope.monthlyPremiumPrice = requestedAmazonProducts[IN_APP_PRODUCTS.MONTHLY_PREMIUM_1].price;
                                    $rootScope.annualPremiumPrice = requestedAmazonProducts[IN_APP_PRODUCTS.ANNUAL_PREMIUM_1].price;
                                });
                                break;

                            case 'FAILED':
                                console.log('******************');
                                console.log('Failed To Get Amazon Product Data');
                                break;

                            default:
                                console.log('******************');
                                console.log('Unsuccessful At Getting Your Amazon Product Data');
                                break;
                        }

                    }
                };

                $window.AmazonIapV2.addListener("getProductDataResponse", getProductDataResponseHandler);

                /**
                 *Request Products
                 */
                var requestedAmazonIAP_ProductIDs = {
                    "skus": [
                        IN_APP_PRODUCTS.MONTHLY_PREMIUM_1,
                        IN_APP_PRODUCTS.ANNUAL_PREMIUM_1
                    ]
                };

                $window.AmazonIapV2.getProductData(
                    function (amazonIAP) {
                        $scope.amazonProductRequestID = amazonIAP.requestId;
                    },
                    null,
                    [requestedAmazonIAP_ProductIDs]
                );

            } else {
                var monthlyPremiumProduct;
                var annualPremiumProduct;
                monthlyPremiumProduct = store.get($scope.monthlyPremiumProduct);
                annualPremiumProduct = store.get($scope.annualPremiumProduct);
                $rootScope.monthlyPremiumPrice = monthlyPremiumProduct ? monthlyPremiumProduct.price : '--';
                $rootScope.annualPremiumPrice = annualPremiumProduct ? annualPremiumProduct.price : '--';
            }

        } else {
            $rootScope.monthlyPremiumPrice = '$X.XX';
            $rootScope.annualPremiumPrice = '$XX.XX';
        }

        if (!$rootScope.annualPremiumPrice) {
            $rootScope.textAboveButtons = $translate.instant('UNABLE_CON');
            $rootScope.textBelowButtons = $translate.instant('UNABLE_CON');
        } else if (!_.isEmpty(globalSworkitAds.liveSubscriptionPurchases)) {
            $rootScope.textAboveButtons = $sce.trustAsHtml(globalSworkitAds.liveSubscriptionPurchases.textAboveButtons);
            $rootScope.textBelowButtons = $sce.trustAsHtml(globalSworkitAds.liveSubscriptionPurchases.textBelowButtons);
        } else {
            $rootScope.textAboveButtons = $sce.trustAsHtml($translate.instant('GOPREMIUM'));
            $rootScope.textBelowButtons = $sce.trustAsHtml($translate.instant('SAVEMONEY'));
        }

        $rootScope.premiumQuote = premiumQuotes[Math.floor(Math.random() * premiumQuotes.length)];
        $rootScope.currentLanguage = PersonalData.GetUserSettings.preferredLanguage;
        $rootScope.closePremiumModal = function () {
            $rootScope.premiumModal.hide();
        };
        $rootScope.openPremiumModal = function () {
            $rootScope.premiumModal.show();
        };
        $timeout(function () {
            $rootScope.openPremiumModal();
        }, 0);

        AccessService.isActiveSubscription()
            .then(function (isActiveSubscription) {
                $rootScope.isActiveSubscription = isActiveSubscription;
            });

        AccessService.isLegacyPro()
            .then(function (isLegacyPro) {
                $rootScope.isLegacyPro = isLegacyPro;
            });

        function showAlreadyPurchased() {
            $ionicLoading.show({
                template: $translate.instant('ALREADY_PURCHASED_PROD'),
                duration: 1500,
                noBackdrop: true
            });
            $rootScope.isActiveSubscription = true;
        }

        function attemptPurchase(product) {
            $rootScope.isAttemptingPurchase = true;
            InAppPurchase.orderProduct(product)
                .then(function () {
                        $log.info('User has completed a new purchase: ', product);
                    },
                    function () {
                        $ionicLoading.show({
                            template: $translate.instant('INCOMPLETE_ORDER'),
                            duration: 5000,
                            noBackdrop: true
                        });
                    }
                );
        }

        function tryProductPurchaseFor(product) {
            var firebaseUID = FirebaseService.getUserUID();
            InAppPurchase.getProduct(product)
                .then(function (premiumProduct) {
                    if (firebaseUID) {
                        AccessService.isActiveSubscription()
                            .then(function (isActiveSubscription) {
                                if (isActiveSubscription) {
                                    showAlreadyPurchased();
                                } else {
                                    attemptPurchase(premiumProduct);
                                }
                            });
                    } else if (premiumProduct.owned) {
                        showAlreadyPurchased();
                    } else {
                        attemptPurchase(premiumProduct);
                    }
                });
        }

        $rootScope.attemptPurchaseMonthly = function () {
            var firebaseUID = FirebaseService.getUserUID();
            if (firebaseUID === null) {
                $scope.needAccountAlert('monthly');
            } else {
                $rootScope.purchaseMonthlySubscription();
            }
        };

        var amazonMonthlyPremiumProductRequestID = '';
        $rootScope.purchaseMonthlySubscription = function () {

            if (isAmazon()) {

                // Define event handler
                var monthlyPremiumProductPurchaseHandler = function (monthlyPremiumProductPurchaseData) {
                    console.log('Attempting to get Monthly Amazon Product Purchase Response');

                    var monthlyPremiumProductPurchaseResponse = monthlyPremiumProductPurchaseData.response;
                    var requestId = monthlyPremiumProductPurchaseResponse.requestId; // string

                    if (requestId === amazonMonthlyPremiumProductRequestID) {
                        var status = monthlyPremiumProductPurchaseResponse.status; // string
                        var monthlyPremiumProductPurchaseReceiptID = monthlyPremiumProductPurchaseResponse.purchaseReceipt.receiptId;

                        switch (status) {
                            case 'ALREADY_ENTITLED':
                                $ionicLoading.show({
                                    template: $translate.instant('ALREADY_PURCHASED_PROD'),
                                    duration: 1500,
                                    noBackdrop: true
                                });
                                break;

                            case 'SUCCESSFUL':
                                $timeout(function () {
                                    // Construct object passed to method as input
                                    var requestOptions = {
                                        "receiptId": monthlyPremiumProductPurchaseReceiptID,
                                        "fulfillmentResult": "FULFILLED"
                                    };

                                    $window.AmazonIapV2.notifyFulfillment(
                                        function (notifyFulfillmentResponse) {
                                            // Handle operation response
                                            $log.debug("notifyFulfillment success, notifyFulfillmentResponse", notifyFulfillmentResponse);
                                        }, function (errorResponse) {
                                            // Handle error response
                                            $log.error("notifyFulfillment error, errorResponse", errorResponse);
                                        },
                                        [requestOptions]);

                                    $rootScope.isActiveSubscription = true;
                                    AccessService.refreshCache();
                                    var firebaseUID = FirebaseService.getUserUID();
                                    if (firebaseUID) {
                                        FirebaseService.ref.child(firebaseUID).update({isPayingCustomer: true},
                                            function (error) {
                                                if (error) {
                                                    $log.warn("Firebase update failure for isPayingCustomer", error);
                                                } else {
                                                    $log.info("Firebase update success for isPayingCustomer");
                                                }
                                            });
                                    }
                                    FiksuTrackingManager.uploadRegistration(FiksuTrackingManager.RegistrationEvent.Event2);
                                    if ($window.analytics) {
                                        $window.analytics.addTransactionItem(
                                            monthlyPremiumProductPurchaseReceiptID,   //Transaction ID
                                            'Sworkit Premium Monthly',   //Transaction Name
                                            'PREMIUMMONTHLY', //SKU Number
                                            'amazon-appstore',   //Category
                                            2.99,    //Price
                                            1,  //Quantity
                                            'USD'  //Currency Code
                                        )
                                    }
                                });
                                break;

                            case 'FAILED':
                                $ionicLoading.show({
                                    template: $translate.instant('INCOMPLETE_ORDER'),
                                    duration: 1500,
                                    noBackdrop: true
                                });
                                break;

                            default:
                                $ionicLoading.show({
                                    template: $translate.instant('INCOMPLETE_ORDER'),
                                    duration: 1500,
                                    noBackdrop: true
                                });

                        }
                    }

                };

                $window.AmazonIapV2.addListener("purchaseResponse", monthlyPremiumProductPurchaseHandler);

                var monthlyPremiumProductRequestOptions = {
                    "sku": IN_APP_PRODUCTS.MONTHLY_PREMIUM_1
                };
                $window.AmazonIapV2.purchase
                (
                    function (monthlyPremiumProductResponse) {
                        amazonMonthlyPremiumProductRequestID = monthlyPremiumProductResponse.requestId;

                    }, function () {
                        $ionicLoading.show({
                            template: $translate.instant('INCOMPLETE_ORDER'),
                            duration: 1500,
                            noBackdrop: true
                        });
                    },
                    [monthlyPremiumProductRequestOptions]
                );

            } else {
                // Purchase Monthly Subscription to Sworkit Premium
                tryProductPurchaseFor($scope.monthlyPremiumProduct);
            }

        };

        $rootScope.attemptPurchaseAnnual = function () {
            var firebaseUID = FirebaseService.getUserUID();
            if (firebaseUID === null) {
                $scope.needAccountAlert('annual');
            } else {
                $rootScope.purchaseAnnualSubscription();
            }
        };

        var amazonAnnualPremiumProductRequestID = '';
        $rootScope.purchaseAnnualSubscription = function () {
            if (isAmazon()) {

                // Define event handler
                var annualPremiumProductPurchaseHandler = function (annualPremiumProductPurchaseData) {
                    console.log('Attempting to get Annual Amazon Product Purchase Response');

                    var annualPremiumProductPurchaseResponse = annualPremiumProductPurchaseData.response;
                    var requestId = annualPremiumProductPurchaseResponse.requestId; // string

                    if (requestId === amazonAnnualPremiumProductRequestID) {
                        var status = annualPremiumProductPurchaseResponse.status; // string
                        var annualPremiumProductPurchaseReceiptID = annualPremiumProductPurchaseResponse.purchaseReceipt.receiptId;

                        switch (status) {
                            case 'ALREADY_ENTITLED':
                                $ionicLoading.show({
                                    template: $translate.instant('ALREADY_PURCHASED_PROD'),
                                    duration: 1500,
                                    noBackdrop: true
                                });
                                break;

                            case 'SUCCESSFUL':
                                $timeout(function () {
                                    // Construct object passed to method as input
                                    var requestOptions = {
                                        "receiptId": annualPremiumProductPurchaseReceiptID,
                                        "fulfillmentResult": "FULFILLED"
                                    };

                                    $window.AmazonIapV2.notifyFulfillment(
                                        function (notifyFulfillmentResponse) {
                                            // Handle operation response
                                            $log.debug("notifyFulfillment success, notifyFulfillmentResponse", notifyFulfillmentResponse);
                                        }, function (errorResponse) {
                                            // Handle error response
                                            $log.error("notifyFulfillment error, errorResponse", errorResponse);
                                        },
                                        [requestOptions]);

                                    $rootScope.isActiveSubscription = true;
                                    AccessService.refreshCache();
                                    var firebaseUID = FirebaseService.getUserUID();
                                    if (firebaseUID) {
                                        FirebaseService.ref.child(firebaseUID).update({isPayingCustomer: true},
                                            function (error) {
                                                if (error) {
                                                    $log.warn("Firebase update failure for isPayingCustomer", error);
                                                } else {
                                                    $log.info("Firebase update success for isPayingCustomer");
                                                }
                                            });
                                    }
                                    FiksuTrackingManager.uploadRegistration(FiksuTrackingManager.RegistrationEvent.Event3);
                                    if ($window.analytics) {
                                        $window.analytics.addTransactionItem(
                                            annualPremiumProductPurchaseReceiptID,   //Transaction ID
                                            'Sworkit Premium Annual',   //Transaction Name
                                            'PREMIUMANNUAL', //SKU Number
                                            'amazon-appstore',   //Category
                                            19.99,    //Price
                                            1,  //Quantity
                                            'USD'  //Currency Code
                                        )
                                    }
                                });
                                break;

                            case 'FAILED':
                                $ionicLoading.show({
                                    template: $translate.instant('INCOMPLETE_ORDER'),
                                    duration: 1500,
                                    noBackdrop: true
                                });
                                break;

                            default:
                                $ionicLoading.show({
                                    template: $translate.instant('INCOMPLETE_ORDER'),
                                    duration: 1500,
                                    noBackdrop: true
                                });

                        }
                    }

                };

                $window.AmazonIapV2.addListener("purchaseResponse", annualPremiumProductPurchaseHandler);

                var annualPremiumProductRequestOptions = {
                    "sku": IN_APP_PRODUCTS.ANNUAL_PREMIUM_1
                };

                $window.AmazonIapV2.purchase(
                    function (annualPremiumProductResponse) {
                        amazonAnnualPremiumProductRequestID = annualPremiumProductResponse.requestId;

                    }, function () {
                        $ionicLoading.show({
                            template: $translate.instant('INCOMPLETE_ORDER'),
                            duration: 1500,
                            noBackdrop: true
                        });
                    },
                    [annualPremiumProductRequestOptions]
                );

            } else {
                // Purchase Annual Subscription to Sworkit Premium
                tryProductPurchaseFor($scope.annualPremiumProduct);
            }

        };

        $rootScope.restorePurchases = function () {
            if (isAmazon()) {
                console.log('Attempting Amazon restore');
                var requestOptions = {
                    "reset": true
                };
                var productPurchaseInformationRequestID = '';
                $window.AmazonIapV2.getPurchaseUpdates(
                    function (purchaseUpdateResponse) {
                        productPurchaseInformationRequestID = purchaseUpdateResponse.requestId;
                    }, null,
                    [requestOptions]
                );
            } else {
                store.refresh();
                if ($rootScope.isActiveSubscription) {
                    $ionicLoading.show({
                        template: $translate.instant('ALREADY_PURCHASED_PROD'),
                        duration: 1500,
                        noBackdrop: true
                    });
                }
            }
        };

        $scope.needAccountAlert = function (subscriptionType) {
            if (device) {
                navigator.notification.confirm(
                    $translate.instant('NEED_ACCOUNT'),
                    function (buttonIndex) {
                        if (buttonIndex == 2) {
                            $rootScope.closePremiumModal();
                            $location.path('/app/auth/welcome');
                        } else if (subscriptionType == 'monthly') {
                            $rootScope.purchaseMonthlySubscription();
                        } else if (subscriptionType == 'annual') {
                            $rootScope.purchaseAnnualSubscription();
                        }
                    },
                    $translate.instant('CREATE_A'),
                    [$translate.instant('NOTYETSKIP'), $translate.instant('OK')]
                );
            } else {
                $ionicPopup.confirm({
                    title: $translate.instant('CREATE_A'),
                    template: '<p class="centered">' + $translate.instant('NEED_ACCOUNT') + '</p>',
                    okType: 'energized',
                    okText: $translate.instant('OK'),
                    cancelText: $translate.instant('NOTYETSKIP')
                })
                    .then(function (res) {
                        if (res) {
                            $timeout(function () {
                                $rootScope.closePremiumModal();
                                $location.path('/app/auth/welcome');
                            }, 500)
                        } else if (subscriptionType == 'monthly') {
                            $rootScope.purchaseMonthlySubscription();
                        } else if (subscriptionType == 'annual') {
                            $rootScope.purchaseAnnualSubscription();
                        }
                    });
            }
        };

        $rootScope.askTrainer = function () {
            var emailBody = "<p>" + $translate.instant('NAME') + ": " + PersonalData.GetUserProfile.firstName + ' ' + PersonalData.GetUserProfile.lastName + ' ' + "</p><p>" + $translate.instant('USERID') + ": " + PersonalData.GetUserProfile.uid + "</p></br>";
            cordova.plugins.email.isAvailable(
                function (isAvailable) {
                    if (isAvailable) {
                        cordova.plugins.email.open({
                            to: ['trainer@sworkit.com'],
                            subject: $translate.instant('ASKSWORKIT'),
                            body: emailBody,
                            isHtml: true
                        }, function (result) {
                            $log.info('EmailComposer result: ' + result);
                        });
                    } else {
                        navigator.notification.alert(
                            'This services requires an email account on your device to be enabled. Please send us an email from another device to trainer@sworkit.com if you see this with your question.',  // message
                            function () {

                            },
                            'Email Required',            // title
                            'Done'                  // buttonName
                        );
                    }
                }
            );

        };
        $rootScope.openFitnessFAQ = function () {
            $window.open('http://sworkit.com/trainfaq', '_blank', 'location=no,AllowInlineMediaPlayback=yes,toolbarposition=top');
        };
    };

    $rootScope.showLowImpactVideos = function () {
        var lowImpactVideoPopupOptions = {
            templateUrl: 'templates/low-impact-video-popup.html',
            title: $translate.instant('PREVIEWEXERC'),
            cssClass: 'low-impact-preview',
            buttons: [
                {text: '<b>Cancel</b>'}
            ]
        };
        $ionicPopup.show(lowImpactVideoPopupOptions);
    };

    $rootScope.showWebAppVideo = function () {
        var webAppVideoPopupOptions = {
            templateUrl: 'templates/web-app-video-popup.html',
            title: "Sworkit Web App",
            cssClass: 'low-impact-preview',
            buttons: [
                {text: '<b>Cancel</b>'}
            ]
        };
        $ionicPopup.show(webAppVideoPopupOptions);
    };

    $scope.init();
});
