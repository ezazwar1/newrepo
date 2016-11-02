angular.module('swMobileApp').factory('AccessService', function ($rootScope, $firebaseObject, $http, FirebaseService, $q, $window, IN_APP_PRODUCTS, $log) {

    var __group = null;
    var __groupCode = null;
    var __isPremiumUser = null;
    var __isGroupPro = null;
    var __isActiveSubscription = null;
    var __isInAppSubscription = null;
    var __legacyBasicAccess = null;

    function _isPremiumUser() {
        if (__isPremiumUser) {
            return $q.when(true);
        } else {
            return _isLegacyPro()
                .then(function (isLegacyPro) {
                    if (isLegacyPro) {
                        __isPremiumUser = true;
                        return __isPremiumUser;
                    } else {
                        return _isGroupPro()
                            .then(function (isGroupPro) {
                                if (isGroupPro) {
                                    _getGroup();
                                    __isPremiumUser = isGroupPro;
                                    return __isPremiumUser;
                                } else {
                                    return _isActiveSubscription()
                                        .then(function (isActiveSubscription) {
                                            __isPremiumUser = isActiveSubscription;
                                            return __isPremiumUser;
                                        })
                                }
                            });
                    }
                });
        }
    }

    function _isLegacyPro() {
        //console.log("_isLegacyPro()");
        var firebaseUID = FirebaseService.getUserUID();
        //console.log("firebaseUID", firebaseUID);
        return localforage.getItem('isLegacyPro')
            .then(function (isLegacyPro) {
                //console.log("isLegacyPro", isLegacyPro);
                if (isLegacyPro) {
                    //console.log("return truthy isLegacyPro", isLegacyPro);
                    return $q.when(isLegacyPro);
                } else if (firebaseUID === null) {
                    //console.log("return false; no firebaseUID");
                    return $q.when(false);
                } else {
                    //console.log("check Firebase");
                    if (navigator.onLine === undefined || navigator.onLine) {
                        var firebaseObject = $firebaseObject(FirebaseService.ref.child(firebaseUID).child('isProAccess'));

                        return firebaseObject.$loaded()
                            .then(function () {
                                //console.log("firebaseObject.$loaded() > then() > firebaseObject.$value", firebaseObject.$value);
                                return localforage.setItem('isLegacyPro', firebaseObject.$value);
                            });
                    } else {
                        return $q.when(false);
                    }
                }
            });
    }

    function _isGroupPro() {
        var firebaseUID = FirebaseService.getUserUID();
        if (__isGroupPro !== null) {
            return $q.when(__isGroupPro);
        } else if (firebaseUID === null) {
            return $q.when(false);
        } else {
            if (navigator.onLine === undefined || navigator.onLine) {
                var firebaseObject = $firebaseObject(FirebaseService.ref.child(firebaseUID).child('userProfile/groupCode'));

                return firebaseObject.$loaded()
                    .then(function () {
                        __groupCode = firebaseObject.sync_value;
                        __isGroupPro = __groupCode ? true : false;
                        return __isGroupPro;
                    });
            } else {
                return $q.when(false);
            }
        }
    }

    function _isActiveSubscription() {
        if (__isActiveSubscription) {
            return $q.when(true);
        } else {
            return _isInAppSubscription()
                .then(function (isInAppSubscription) {
                    if (isInAppSubscription) {
                        return $q.when(isInAppSubscription);
                    } else {
                        if (__group) {
                            if (__isActiveSubscription || __group.isActiveSubscription) {
                                return $q.when(__group.isActiveSubscription);
                            } else {
                                return $q.when(false);
                            }
                        } else {
                            if (__groupCode) {
                                return _getGroup()
                                    .then(function (group) {
                                        __group = group;
                                        return $q.when(__group.isActiveSubscription);
                                    });
                            } else {
                                return _isGroupPro()
                                    .then(function () {
                                        return _getGroup()
                                            .then(function (group) {
                                                if (group) {
                                                    __group = group;
                                                    return $q.when(__group.isActiveSubscription);
                                                } else {
                                                    return $q.when(false);
                                                }
                                            });
                                    });
                            }
                        }
                    }
                });
        }
    }

    function _isInAppSubscription() {
        if (ionic.Platform.isWebView()) {
            if (isAmazon()) {
                return $q.when($rootScope.isActiveSubscription);
            } else {
                var firebaseUID = FirebaseService.getUserUID();
                var monthlyPremiumProduct1 = $window.store.get(IN_APP_PRODUCTS.MONTHLY_PREMIUM_1);
                var annualPremiumProduct1 = $window.store.get(IN_APP_PRODUCTS.ANNUAL_PREMIUM_1);
                var monthlyPremiumProduct2 = $window.store.get(IN_APP_PRODUCTS.MONTHLY_PREMIUM_2);
                var annualPremiumProduct2 = $window.store.get(IN_APP_PRODUCTS.ANNUAL_PREMIUM_2);
                if (__isInAppSubscription) {
                    return $q.when(__isInAppSubscription);
                } else {
                    if (firebaseUID) {
                        return $http.get('https://sworkit-validation.herokuapp.com/isPayingCustomer/' + firebaseUID)
                            .then(function (response) {
                                $log.debug("API isPayingCustomer response 1", response);
                                if (response && response.data && response.data.isPayingCustomer) {
                                    __isInAppSubscription = true;
                                    return $q.when(true);
                                } else {
                                    // owned will be true even if subscription is expired, at least with response.data.expiredSubscription we know who has really expired, still being very safe here because of the inapppurchase plugin limitations
                                    if ((monthlyPremiumProduct1.owned || annualPremiumProduct1.owned || monthlyPremiumProduct2.owned || annualPremiumProduct2.owned) && (response && response.data && !response.data.expiredSubscription)) {
                                        __isInAppSubscription = true;
                                        return $q.when(true);
                                    } else {
                                        __isInAppSubscription = false;
                                        return $q.when(false);
                                    }
                                }
                            }, function () {
                                // owned will be true even if subscription is expired
                                if (monthlyPremiumProduct1.owned || annualPremiumProduct1.owned || monthlyPremiumProduct2.owned || annualPremiumProduct2.owned) {
                                    __isInAppSubscription = true;
                                    return $q.when(true);
                                } else {
                                    __isInAppSubscription = false;
                                    return $q.when(false);
                                }
                            });
                    } else {
                        if (annualPremiumProduct1.owned || annualPremiumProduct2.owned) {
                            $log.debug("API no firebaseUID, but we'll allow annuals without accounts");
                            __isInAppSubscription = true;
                            return $q.when(true);
                        } else {
                            __isInAppSubscription = false;
                            return $q.when(false);
                        }
                    }
                }
            }
        } else {
            var firebaseUID = FirebaseService.getUserUID();
            if (__isInAppSubscription) {
                return $q.when(__isInAppSubscription);
            } else {
                if (firebaseUID) {
                    return $http.get('https://sworkit-validation.herokuapp.com/isPayingCustomer/' + firebaseUID)
                        .then(function (response) {
                            $log.debug("API isPayingCustomer response 2", response);
                            if (response && response.data && response.data.isPayingCustomer) {
                                __isInAppSubscription = true;
                                return $q.when(true);
                            } else {
                                return $q.when(false);
                            }
                        }, function () {
                            $log.warn('could not verifiy sworkit-validation status');
                        });
                } else {
                    return $q.when(false);
                }
            }
        }

    }

    function _refreshCache() {
        __group = null;
        __groupCode = null;
        __isPremiumUser = null;
        localforage.removeItem('isLegacyPro');
        __isGroupPro = null;
        __isActiveSubscription = null;
        __isInAppSubscription = null;
        __legacyBasicAccess = null;
        _isPremiumUser();
    }

    function _setGroupPro(status, groupName) {
        __isGroupPro = status;
        __isPremiumUser = status;
        if (groupName) {
            __groupCode = groupName;
            _getGroup();
        }
    }

    function _getGroup() {
        if (__group) {
            return $q.when(__group);
        } else {
            if (__groupCode) {
                var firebaseObject = $firebaseObject(FirebaseService.groupsRef.child(__groupCode));

                return firebaseObject.$loaded()
                    .then(function () {
                        __group = firebaseObject;
                        return firebaseObject;
                    });
            } else {
                return $q.when(false);
            }
        }
    }

    function _isknownPremium() {
        return $q.when(__isPremiumUser);
    }

    function _knownLegacyBasicAccess() {
        if (__legacyBasicAccess === null) {
            return _getBasicAccess();
        } else {
            return $q.when(__legacyBasicAccess);
        }
    }

    function _getBasicAccess() {
        console.log("_getBasicAccess()");
        var firebaseUID = FirebaseService.getUserUID();
            return localforage.getItem('legacyBasicAccess')
                .then(function (legacyBasicAccess) {
                    // console.log("legacyBasicAccess", legacyBasicAccess);
                    if (parseInt(legacyBasicAccess) == 0) {
                        // console.log("legacyBasicAccess > localforageItem == 0");
                        __legacyBasicAccess = parseInt(legacyBasicAccess);
                        return $q.when(__legacyBasicAccess);
                    } else if (firebaseUID === null) {
                        // console.log("return false; no firebaseUID");
                        __legacyBasicAccess = 1;
                        return $q.when(__legacyBasicAccess);
                    } else {
                        // console.log("check Firebase if navigator.onLine", navigator.onLine);
                        if (navigator.onLine === undefined || navigator.onLine) {
                            var firebaseObject = $firebaseObject(FirebaseService.ref.child(firebaseUID).child('segment').child('legacyBasicAccess'));

                            return firebaseObject.$loaded()
                                .then(function () {
                                    // console.log("firebaseObject for segment child", firebaseObject);
                                    __legacyBasicAccess = firebaseObject.$value ? firebaseObject.$value : 0;
                                    if (firebaseObject && !firebaseObject.$value) {
                                        localforage.setItem('legacyBasicAccess', __legacyBasicAccess);
                                    }
                                    return __legacyBasicAccess;
                                });
                        } else {
                            __legacyBasicAccess = 1;
                            return $q.when(__legacyBasicAccess); //1 is the default legacyBasicAccess if not in localforage or cannot connect to check Firebase
                        }
                    }
                });
    }

    return {
        isPremiumUser: _isPremiumUser,
        isLegacyPro: _isLegacyPro,
        isGroupPro: _isGroupPro,
        setGroupPro: _setGroupPro,
        getGroup: _getGroup,
        refreshCache: _refreshCache,
        isActiveSubscription: _isActiveSubscription,
        isKnownPremium: _isknownPremium,
        getBasicAccess: _getBasicAccess,
        knownLegacyBasicAccess: _knownLegacyBasicAccess
    }

});
