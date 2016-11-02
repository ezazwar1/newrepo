//'use strict';
//MyApp.controller('ContactsPageCtrl', ['$scope',
//  '$ionicModal',
//  '$timeout',
//  '$ionicPopup',
//  '$state',
//  '$ionicLoading',
//  'SettingsService',
//  'CountryCodeService',
//  'FeedService',
//  '$cordovaSms',
//  '$rootScope',
//  '$window',
//  '_',
//  function ($scope,
//            $ionicModal,
//            $timeout,
//            $ionicPopup,
//            $state,
//            $ionicLoading,
//            SettingsService,
//            CountryCodeService,
//            FeedService,
//            $cordovaSms,
//            $rootScope,
//            $window,
//            UserService,
//            _
//  ) {
//
//    $ionicLoading.show({
//      template: '<i class="icon ion-loading-c"></i>'
//    });
//    $scope.contacts = [];
//    $scope.disableCreateBtn = false;
//    //$scope.currentPhoneCode = null;
//
//    /**
//     * Retrieve current device country code
//     */
//      //CountryCodeService.getDeviceCountryCode().then(function(countryCode) {
//      //  $scope.currentPhoneCode = countryCode;
//      //}).catch(function(data) {
//      //  console.log('country code error');
//      //  console.log(data);
//      //});
//
//    $scope.openChat = function(partnerInfo) {
//      UserService.setPartnerData(partnerInfo);
//
//      $state.go("app.chat", {partner_number: partnerInfo.mobilenumber});
//    };
//
//    SettingsService.getPhoneContacts().then(function (phoneContacts) {
//      $scope.contacts = _.sortBy(phoneContacts, 'name');
//      /**
//       * Added debug for see contacts list.
//       */
//        //$rootScope.debugInfo($scope.contacts);
//      $ionicLoading.hide();
//    }).catch(function (error) {
//
//      $ionicPopup.alert({
//        template: '<div>' + error + '</div>'
//      });
//
//      window.plugins.toast.showShortCenter("Unable to read phone contacts", function (a) {
//        console.log('toast error: ' + a)
//      }, function (b) {
//        alert('toast error: ' + b)
//      });
//      $ionicLoading.hide();
//    });
//
//    $scope.createTriby = function () {
//      var selectedContacts = _.where($scope.contacts, {checked: true});
//      var triby = FeedService.getNewTriby();
//
//      triby.members = [];
//      triby.memberContacts = [];
//      $scope.disableCreateBtn = true;
//
//      if(selectedContacts && selectedContacts.length > 0) {
//        _.each(selectedContacts, function (contact) {
//          var mobilenumber = contact.mobilenumber.replace(/[^0-9\+]/g, "");
//
//          /**
//           * Check number if it isn't in international format add current device country code
//           */
//            //if (!CountryCodeService.isInternationalNumber(mobilenumber) && _.isString($scope.currentPhoneCode) && $scope.currentPhoneCode.length) {
//            //  mobilenumber = $scope.currentPhoneCode + mobilenumber;
//            //}
//
//          triby.members.push(mobilenumber);
//          triby.memberContacts.push({
//            mobilenumber: mobilenumber,
//            name: contact.name || '',
//            pic: contact.pic || ''
//          });
//        });
//      }
//
//      var callback  = function () {
//        FeedService.saveTriby(triby).then(function (response) {
//
//          function postProcessing() {
//            window.plugins.toast.showShortCenter("New Triby created successfully", function (a) {
//              console.log('toast success: ' + a)
//            }, function (b) {
//              alert('toast error: ' + b)
//            });
//
//            $timeout(function () {
//              $state.go('app.main.home');
//            }, 100);
//          }
//
//          if (response.status == "success") {
//            if (response.usersToInvite !== undefined && response.usersToInvite.length > 0) {
//              $cordovaSms
//                .send(response.usersToInvite.join(', '), 'Hey, I’d like to chat with you on Triby Messenger. It offers both a Messenger and Private Individual Group Newsfeeds. Download it now at: http://triby.co/dl', {android: {intent: 'INTENT'}})
//                .then(function () {
//                  console.log('sms: send');
//                  postProcessing();
//                }, function (error) {
//                  $scope.disableCreateBtn = false;
//                  postProcessing();
//                  console.log('sms: error:' + error);
//                });
//            } else {
//              postProcessing();
//            }
//          }
//          else {
//            window.plugins.toast.showShortCenter(response.message, function (a) {
//              console.log('toast success: ' + a)
//            }, function (b) {
//              alert('toast error: ' + b)
//            });
//          }
//        }).catch(function (error) {
//          $scope.disableCreateBtn = false;
//          window.plugins.toast.showShortCenter(error, function (a) {
//            console.log('toast success: ' + a)
//          }, function (b) {
//            alert('toast error: ' + b)
//          });
//        });
//      };
//
//      var parallels = {};
//
//      _.each(triby.memberContacts, function(contact) {
//        if (contact.pic) {
//          parallels[ contact.mobilenumber ] = function(callback) {
//            SettingsService.uploadImage(contact.pic, contact.name).then(function(data) {
//              callback(null, data);
//            }).catch(function(err) {
//              callback(null);
//            })
//          }
//        }
//      });
//
//
//      if (_.size(parallels)) {
//        async.parallel(parallels, function(err, data) {
//          var contact,index;
//
//          _.each(data, function(item, mobilenumber) {
//            if (_.isObject(item)) {
//              contact = _.findWhere(triby.memberContacts, {mobilenumber: mobilenumber});
//              index = _.indexOf(triby.memberContacts, contact);
//              triby.memberContacts[index].pic = item.url_file;
//            }
//          });
//
//          callback();
//        });
//      } else {
//        callback();
//      }
//    };
//
//    // go to triby info page
//    $scope.goBack = function () {
//      $timeout(function () {
//        history.back();
//      }, 20);
//    }
//  }]);
//
//
