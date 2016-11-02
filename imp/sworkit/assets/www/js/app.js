angular.module('swMobileApp', ['ngCordova', 'ionic.contrib.drawer', 'ionic', 'swMobileApp', 'nvd3ChartDirectives', 'swAutocomplete', 'ngCookies', 'pascalprecht.translate', 'angular-progress-arc', 'AutoFontSize', 'underscore', 'ngIOS9UIWebViewPatch', 'angularMoment', 'firebase', 'ionic.contrib.ui.hscrollcards'])
    .constant('IN_APP_PRODUCTS', {
        ANNUAL_PREMIUM_1: 'ahorsecalledscarlet.sworkit.annualpremium',
        MONTHLY_PREMIUM_1: 'ahorsecalledscarlet.sworkit.monthlypremium',
        ANNUAL_PREMIUM_2: 'ahorsecalledscarlet.sworkit.annualpremium_2',
        MONTHLY_PREMIUM_2: 'ahorsecalledscarlet.sworkit.monthlypremium_2',
        BASE_SKU: 'ahorsecalledscarlet.sworkit'
    })
    .config(function ($provide) {
        $provide.decorator("$exceptionHandler", function ($delegate) {
            return function (exception, cause) {
                $delegate(exception, cause);
                var platformCategory = ionic.Platform.isAndroid() ? 'Sworkit Google' : 'Sworkit iOS';
                var jsMessage = exception.message + " - " + exception.stack + ' - ' + PersonalData.GetUserSettings.preferredLanguage;
                if (window.analytics) {
                    window.analytics.trackEvent(platformCategory, "AngularJS Error", jsMessage, 0);
                }
            };
        });
    })
    .config(function ($ionicConfigProvider) {
        $ionicConfigProvider.views.swipeBackEnabled(false);
        $ionicConfigProvider.backButton.previousTitleText(false).text(' ').icon('ion-ios-arrow-left');
        $ionicConfigProvider.views.transition('platform');
        $ionicConfigProvider.platform.android.views.transition('android');
        $ionicConfigProvider.navBar.alignTitle('platform');
        $ionicConfigProvider.views.maxCache(1);
    })
    .config(function ($stateProvider, $urlRouterProvider, $translateProvider) {
        for (lang in translations) {
            $translateProvider.translations(lang, translations[lang]);
        }
        if (window.localStorage['NG_TRANSLATE_LANG_KEY'] == undefined || !window.localStorage['NG_TRANSLATE_LANG_KEY']) {
            var useLang = 'EN';
            var nav = window.navigator, browserLanguagePropertyKeys = [
                'language',
                'browserLanguage',
                'systemLanguage',
                'userLanguage'
            ], i, language;
            if (angular.isArray(nav.languages)) {
                for (i = 0; i < nav.languages.length; i++) {
                    language = nav.languages[i];
                    if (language && language.length) {
                        useLang = language;
                    }
                }
            }
            for (i = 0; i < browserLanguagePropertyKeys.length; i++) {
                language = nav[browserLanguagePropertyKeys[i]];
                if (language && language.length) {
                    useLang = language;
                }
            }

            var firstLang = 'EN';
            var twoLetterISO = useLang.substring(0, 2).toUpperCase();
            if (twoLetterISO == 'ES' && useLang.length > 2) {
                firstLang = 'ESLA';
            } else if (twoLetterISO == 'DE' || twoLetterISO == 'RU' || twoLetterISO == 'TR' || twoLetterISO == 'FR' || twoLetterISO == 'PT' || twoLetterISO == 'IT' || twoLetterISO == 'ES' || twoLetterISO == 'HI' || twoLetterISO == 'JA' || twoLetterISO == 'ZH' || twoLetterISO == 'KO') {
                firstLang = twoLetterISO;
            }

            $translateProvider.preferredLanguage(firstLang);
            $translateProvider.useLocalStorage();
        } else {
            $translateProvider.preferredLanguage('EN');
            $translateProvider.useLocalStorage();
        }
    })
    .run(function ($ionicPlatform, WorkoutService, $window, IN_APP_PRODUCTS, AccessService, SyncService, $rootScope, $timeout, FirebaseService, $log) {
        'use strict';

        $log.info("~~~~~~~~~~ App Launch ~~~~~~~~~~");

        $ionicPlatform.ready()
            .then(function () {
                if (window.StatusBar) {
                    StatusBar.styleDefault();
                }

                if (ionic.Platform.isWebView()) {

                    checkForReceipts();
                    //
                    /**
                     * Check If Its An Amazon App
                     */
                    if (isAmazon()) {
                        var productPurchaseInformationRequestID = '';
                        var amazonIAP = window.AmazonIapV2;

                        var getPurchaseUpdatesResponseHandler = function (purchaseUpdateData) {
                            $log.info("getPurchaseUpdatesResponseHandler()");
                            $log.debug("purchaseUpdateData", JSON.stringify(purchaseUpdateData));
                            var purchaseUpdateResponse = purchaseUpdateData.response;
                            var requestID = purchaseUpdateResponse.requestId; // string
                            var premiumProductsReceipts = purchaseUpdateResponse.receipts; // array of PurchaseReceipt objects

                            // for each item in receipts you can get the following values
                            //var receiptId = receipts[0].receiptId; // string
                            //var cancelDate = receipts[0].cancelDate; // long
                            //var purchaseDate = receipts[0].purchaseDate; // long
                            //var sku = receipts[0].sku; // string
                            //var productType = receipts[0].productType; // string

                            if (requestID === productPurchaseInformationRequestID) {
                                angular.forEach(premiumProductsReceipts, function (premiumProductReceipt) {
                                    if (premiumProductReceipt.sku == IN_APP_PRODUCTS.BASE_SKU) {
                                        $timeout(function () {
                                            if (premiumProductReceipt.cancelDate !== null) {
                                                $rootScope.isActiveSubscription = true;
                                            } else if (premiumProductReceipt.cancelDate === null) {
                                                $rootScope.isActiveSubscription = false;
                                            } else {
                                                $log.warn("Incorrect state understanding of Amazon purchase");
                                                $rootScope.isActiveSubscription = false;
                                            }
                                        });

                                    }
                                });
                            }

                        };

                        amazonIAP.addListener("getPurchaseUpdatesResponse", getPurchaseUpdatesResponseHandler);

                        var requestOptions = {
                            "reset": true
                        };

                        amazonIAP.getPurchaseUpdates(
                            function (purchaseUpdateResponse) {
                                $log.info("AmazonIAP purchase update");
                                $log.debug("purchaseUpdateResponse", JSON.stringify(purchaseUpdateResponse));
                                productPurchaseInformationRequestID = purchaseUpdateResponse.requestId;
                            }, null,
                            [requestOptions]
                        );

                    } else {
                        // TODO: Where is best place for IAP code to live?
                        // TODO: Make use of optional `alias` property on these store product objects?
                        // TODO: Should these product objects be defined as a whole in `constant('IN_APP_PRODUCTS')`?
                        $window.store.register({
                            id: IN_APP_PRODUCTS.MONTHLY_PREMIUM_1,
                            type: $window.store.PAID_SUBSCRIPTION
                        });
                        $window.store.register({
                            id: IN_APP_PRODUCTS.ANNUAL_PREMIUM_1,
                            type: $window.store.PAID_SUBSCRIPTION
                        });
                        $window.store.register({
                            id: IN_APP_PRODUCTS.MONTHLY_PREMIUM_2,
                            type: $window.store.PAID_SUBSCRIPTION
                        });
                        $window.store.register({
                            id: IN_APP_PRODUCTS.ANNUAL_PREMIUM_2,
                            type: $window.store.PAID_SUBSCRIPTION
                        });

                        $window.store.when(IN_APP_PRODUCTS.MONTHLY_PREMIUM_1)
                            .updated(function (monthlyPremiumProduct) {
                                $log.info('Updated Monthly Premium Product 1');
                                $log.debug("monthlyPremiumProduct", monthlyPremiumProduct);
                            });
                        $window.store.when(IN_APP_PRODUCTS.ANNUAL_PREMIUM_1)
                            .updated(function (annualPremiumProduct) {
                                $log.info('Updated Annual Premium Product 1');
                                $log.debug("annualPremiumProduct", annualPremiumProduct);
                            });
                        $window.store.when(IN_APP_PRODUCTS.MONTHLY_PREMIUM_2)
                            .updated(function (monthlyPremiumProduct) {
                                $log.info('Updated Monthly Premium Product 2');
                                $log.debug("monthlyPremiumProduct", monthlyPremiumProduct);
                            });
                        $window.store.when(IN_APP_PRODUCTS.ANNUAL_PREMIUM_2)
                            .updated(function (annualPremiumProduct) {
                                $log.info('Updated Annual Premium Product 2');
                                $log.debug("annualPremiumProduct", annualPremiumProduct);
                            });

                        $window.store.when(IN_APP_PRODUCTS.MONTHLY_PREMIUM_1)
                            .approved(function (monthlyPremiumProductOrder) {
                                processApprovedPremiumProduct(monthlyPremiumProductOrder, IN_APP_PRODUCTS.MONTHLY_PREMIUM_1);
                            });
                        $window.store.when(IN_APP_PRODUCTS.ANNUAL_PREMIUM_1)
                            .approved(function (annualPremiumProductOrder) {
                                processApprovedPremiumProduct(annualPremiumProductOrder, IN_APP_PRODUCTS.ANNUAL_PREMIUM_1);
                            });
                        $window.store.when(IN_APP_PRODUCTS.MONTHLY_PREMIUM_2)
                            .approved(function (monthlyPremiumProductOrder) {
                                processApprovedPremiumProduct(monthlyPremiumProductOrder, IN_APP_PRODUCTS.MONTHLY_PREMIUM_2);
                            });
                        $window.store.when(IN_APP_PRODUCTS.ANNUAL_PREMIUM_2)
                            .approved(function (annualPremiumProductOrder) {
                                processApprovedPremiumProduct(annualPremiumProductOrder, IN_APP_PRODUCTS.ANNUAL_PREMIUM_2);
                            });

                        $window.store.refresh();

                    }

                }

            });

        function processApprovedPremiumProduct(productOrder, storeProductIdOrAlias) {
            $log.info("processApprovedPremiumProduct()");
            $log.debug("productOrder", productOrder);
            // TODO: If we can confirm that productOrder, as passed from $window.store.when().approved() has transaction id and type for GA, then we don't need to re-get that in here
            // TODO: and can remove storeProductIdOrAlias param along with it.
            $timeout(function () {
                // Original order of operations:
                productOrder.finish();
                $log.debug("productOrder after finish()", productOrder);
                var premiumProduct = $window.store.get(storeProductIdOrAlias);
                $log.debug("premiumProduct (after $window.store.get()", premiumProduct);
                $rootScope.isActiveSubscription = true;
                AccessService.refreshCache();
                WorkoutService.unlockForSubscription()
                    .then(WorkoutService.manageDownloads);
                setFirebaseUserIsPayingCustomer();
                checkForReceipts();
                if ($rootScope.isAttemptingPurchase) {
                    FiksuTrackingManager.uploadRegistration(FiksuTrackingManager.RegistrationEvent.Event2);
                    trackGoogleAnalyticsForSubscriptionPurchase(premiumProduct);
                    SyncService.pushArray($rootScope.userInterest + '-purchase', 'premiumInterest');
                }
                // TODO: We should review, optimize, and test
                // My proposed optimized order:
                //AccessService.refreshCache();
                //WorkoutService.unlockForSubscription()
                //    .then(function () {
                //        var premiumProduct = $window.store.get(storeProductIdOrAlias);
                //        trackGoogleAnalyticsForSubscriptionPurchase(premiumProduct);
                //        FiksuTrackingManager.uploadRegistration(FiksuTrackingManager.RegistrationEvent.Event2);
                //        setFirebaseUserIsPayingCustomer();
                //        productOrder.finish();
                //        $rootScope.isActiveSubscription = true;
                //        WorkoutService.manageDownloads();
                //    });
            });
        }

        function recordTransactions() {
            $log.info("recordTransactions()");
            var firebaseUID = FirebaseService.getUserUID();
            if (ionic.Platform.isIOS()) {
                FirebaseService.ref.child(firebaseUID).child('receipts').child('apple/transactions').update(
                    window.storekit.receiptForTransaction, function (error) {
                        if (error) {
                            console.log('Synchronization failed', error);
                        } else {
                            console.log('Synchronization succeeded');
                        }
                    });
            } else {

            }
        }

        function checkForReceipts() {
            $log.info("checkForReceipts()");
            var firebaseUID = FirebaseService.getUserUID();
            if (firebaseUID) {
                $log.debug("firebaseUID", firebaseUID);
                if (ionic.Platform.isIOS()) {
                    var purchasedProducts = Object.keys(window.storekit.receiptForProduct);
                    if (purchasedProducts.length > 0) {
                        angular.forEach(purchasedProducts, function (productID) {
                            var productNameArray = productID.split('.');
                            var productShortName = productNameArray[2];
                            var receipt = window.storekit.receiptForProduct[productID];
                            sendReceiptToFirebase(firebaseUID, productShortName, productID, receipt);
                        });
                    }
                } else {
                    $window.store.android.getPurchases(function (purchases) {
                        $log.debug("Android purchases", purchases);
                        angular.forEach(purchases, function (purchase) {
                            $log.debug("Android purchase", purchase);
                            var productNameArray = purchase.productId.split('.');
                            var productShortName = productNameArray[2];
                            sendReceiptToFirebase(firebaseUID, productShortName, purchase.productId, purchase);
                        });
                    }, function (error) {
                        $log.warn("Android get purchases failed", error);
                    });
                }
                recordTransactions();
            } else {
                $log.debug("No FIREBASEUID; Skipping check for receipts");
            }
        }

        function sendReceiptToFirebase(uid, productName, productID, receipt) {
            var product = window.store.get(productID);
            var platform;
            if (ionic.Platform.isIOS()) {
                platform = "apple";
            } else {
                platform = "google";
                delete product.transaction;
            }
            var onComplete = function (error) {
                if (error) {
                    $log.error("Receipt synchronization failed", error);
                } else {
                    $log.debug("Receipt synchronization succeeded");
                }
            };
            var productRef = FirebaseService.ref.child(uid).child('receipts').child(platform).child(productName);
            productRef.once('value', function (snapshot) {
                var firebaseProduct = snapshot.val();
                var receiptData = {};
                receiptData['receipt'] = platform === 'apple' ? window.storekit.receiptForProduct[productID] : receipt;
                if (!firebaseProduct) {
                    receiptData['purchaseDate'] = Firebase.ServerValue.TIMESTAMP;
                    receiptData['product'] = product;
                }
                productRef.update(receiptData, onComplete);
            });
        }

        function trackGoogleAnalyticsForSubscriptionPurchase(premiumProduct) {
            if ($window.analytics && premiumProduct) {
                var txName = '';
                var sku = '';
                var price = 0;
                switch (premiumProduct.id) {
                    case IN_APP_PRODUCTS.MONTHLY_PREMIUM_1:
                        txName = 'Sworkit Premium Monthly';
                        sku = 'PREMIUMMONTHLY';
                        price = 2.99;
                        break;
                    case IN_APP_PRODUCTS.MONTHLY_PREMIUM_2:
                        txName = 'Sworkit Premium Monthly';
                        sku = 'PREMIUMMONTHLY2';
                        price = 4.99;
                        break;
                    case IN_APP_PRODUCTS.ANNUAL_PREMIUM_1:
                        txName = 'Sworkit Premium Annual';
                        sku = 'PREMIUMANNUAL';
                        price = 19.99;
                        break;
                    case IN_APP_PRODUCTS.ANNUAL_PREMIUM_2:
                        txName = 'Sworkit Premium Annual';
                        sku = 'PREMIUMANNUAL2';
                        price = 39.99;
                        break;
                }
                $window.analytics.addTransactionItem(
                    premiumProduct.transaction.id, // Transaction ID
                    txName, // Transaction Name
                    sku, // SKU Number
                    premiumProduct.transaction.type, // Category
                    price, // Price
                    1, // Quantity
                    'USD' // Currency Code
                )
            }
        }

        function setFirebaseUserIsPayingCustomer() {
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
        }

        // TODO: At some point we probably don't need these for testing/debugging and could delete them
        $window.testGetUserExercises = WorkoutService.getUserExercises;
        $window.testUnlockForGroupPro = WorkoutService.unlockForGroupPro;
        $window.testUnlockForCreateUserAccount = WorkoutService.unlockForCreateUserAccount;
        $window.testUnlockForSubscription = WorkoutService.unlockForSubscription;
        $window.testManageDownloads = WorkoutService.manageDownloads;
        $window.testDownloadUnlockedExercises = WorkoutService.downloadUnlockedExercises;
        $window.testDeleteAllDownloadedExercises = WorkoutService.deleteAllDownloadedExercises;
        $window.testGetDirectoryList = WorkoutService.getDirectoryList;
        $window.testGetDownloadedFilenames = WorkoutService.getDownloadedFilenames;
        $window.testReset = function () {
            $log.info("testReset()");
            localforage.clear(function () {
                WorkoutService.deleteAllDownloadedExercises()
                    .then(function () {
                        $log.info("testReset COMPLETE");
                    });
            });
        };
    });
