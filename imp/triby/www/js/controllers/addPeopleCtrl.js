'use strict';
MyApp.controller('AddPeopleCtrl', ['$scope',
  '$ionicModal',
  '$timeout',
  '$ionicPopup',
  '$location',
  '$ionicLoading',
  '$cordovaSms',
  'SettingsService',
  'CountryCodeService',
  'FeedService',
  '$rootScope',
  '$window',
  'UserService',
  '$state',
  '$ionicHistory',
  '_',
  function ($scope,
            $ionicModal,
            $timeout,
            $ionicPopup,
            $location,
            $ionicLoading,
            $cordovaSms,
            SettingsService,
            CountryCodeService,
            FeedService,
            $rootScope,
            $window,
            UserService,
            $state,
            $ionicHistory,
            _
  ) {

    if (window.StatusBar) {
      StatusBar.overlaysWebView(true);
    }

//    var smsText = 'Let\'s chat on "Triby Messenger". You can delete your sent messages and posts from everyone\'s phone in real time. Download it Free @ http://triby.co/dl';
    var smsText = 'Add me on Triby! http://triby.co/dl';
    $scope.contacts = [];
    $scope.regUsers = [];
    $scope.regUsersForAdding = [];
    $scope.invitesLength = 0;
    $scope.query='';

    var checkingTimeout = 50;
    var checkingTimeoutFinished = true;
    var creatingIsInProgress = false;
    var registeredContacts = [];
    //var invitesLength = 0;

    $scope.checkedCount = function() {
      if(checkingTimeoutFinished) {
        checkingTimeoutFinished = false;

        setTimeout(function() {
          checkingTimeoutFinished = true;
        }, checkingTimeout);

        console.log('returning string');
        $scope.invitesLength = _.where($scope.contacts, {checked: true}).length;
        return $scope.invitesLength;
      } else {
        console.log('checkedCount called');
        return $scope.invitesLength;
      }
    };

    $scope.inviteToTriby = function() {
      var selectedContacts = _.where($scope.contacts, {checked: true});

      if(!selectedContacts || selectedContacts.length === 0) return;

      $ionicLoading.show({
        template: '<p> Loading </p><i class="icon ion-loading-c"></i>'
      });

      $timeout(function () {
        $ionicLoading.hide();
      }, 3000);

      var usersToInvite = selectedContacts.map(function(contact) {
        return contact.mobilenumber.replace(/[^0-9\+]/g, "");
      });

      $cordovaSms
        .send(usersToInvite.join(', '), smsText, {android: {intent: 'INTENT'}})
        .then(function () {
          $ionicLoading.hide();
          $timeout(function () {
            $ionicHistory.backView();
          }, 20);
        }, function (error) {
          $ionicLoading.hide();
          $timeout(function () {
            $ionicHistory.backView();
          }, 20);
        });
    };

    var triby = FeedService.getNewTriby(),
      contactsNumbers = [],
      userData = UserService.getAuthData(),
      userCountryCode;

    //getting user country for adding it to the numbers that has not country code for detecting registered users on the server
    CountryCodeService.getCurrentCountryCode(function(result){
      if(result.status === 'success') {
        userCountryCode = result.currentCountryCode;
      } else {
        userCountryCode = '+';
      }
    }, userData.country);

    $ionicLoading.show({
      template: '<p> Loading </p><i class="icon ion-loading-c"></i>'
    });

    /**
     * Retrieve current user locale object
     */
    async.parallel({
      contacts: function(callback) {
        SettingsService.getPhoneContacts().then(function (phoneContacts) {
          var contacts = _.sortBy(phoneContacts, 'name');

          $timeout(function () {
            $ionicLoading.hide();
          }, 3000);
          callback(null, contacts);
        }).catch(function (error) {
          $ionicPopup.alert({
            template: '<div>' + error + '</div>'
          });
          window.plugins.toast.showShortCenter("Unable to read phone contacts", function (a) {
            console.log('toast error: ' + a)
          }, function (b) {
            alert('toast error: ' + b)
          });
          $ionicLoading.hide();
          callback(null, error);
        });
      }
    }, function(err, data) {
      var additionalNumbers = [],
        contactsNumbers = [];

      $scope.contacts = _.map(data.contacts, function (contact) {
        var mobilenumber = contact.mobilenumber.replace(/[^0-9\+]/g, "");
        contactsNumbers.push(mobilenumber);

        if(mobilenumber[0] !== '+') {
          additionalNumbers = additionalNumbers.concat(createNumbersWithCountryCode(mobilenumber));
        }

        return contact;
      });
      console.log('CTRL additionalNumbers!!!!!!!!!!!!!!!!!', additionalNumbers)
      _getRegisteredUsers(contactsNumbers.concat(additionalNumbers));
    });

    $scope.searchByProfileName = function(profileName) {
      if(!profileName || profileName === '') {
        return $scope.regUsers = registeredContacts;
      } else if(profileName.length < 2) {
        return $scope.regUsers = [];
      }

      UserService.searchByProfileName(profileName).then(function(result) {
        if(result) {
          if(result.data.status === 'success') {
            if(result.data.users.length) {
              //$scope.regUsers = result.data.users;
//                 $scope.$broadcast('slide:show', res.users[res.users.length - 1]);

              $scope.regUsers = result.data.users.map(function(contact) {
                var contactIndex = _.findIndex($scope.regUsersForAdding, function (existingContact) {
                  return contact.mobilenumber === existingContact.mobilenumber
                });

                if(contactIndex > -1) {
                  contact.checked = true;
                }
                console.log('add People contact', contact);

                return contact;
              })
            } else {
              $scope.regUsers = [];
            }
           } else {
            window.plugins.toast.showShortCenter(result.data.message || 'Server error!', function (a) {},
              function (b) {
                alert(result.data.message || 'Server error!');
              });
          }
        } else {
          $scope.regUsers = [];
          window.plugins.toast.showShortCenter('Can\'t get response from the server!', function (a) {},
            function (b) {
              alert('Can\'t get response from the server!');
            });
        }
      }, function(err) {
        $scope.regUsers = [];
        window.plugins.toast.showShortCenter(err || 'Server error!', function (a) {},
          function (b) {
            alert(err || 'Server error!');
          });
      })
    };

    $scope.updateUsersForAdding = function(userData) {
      var contactIndex, indexInRegContacts;

      if(userData.checked) {
        contactIndex = _.findIndex($scope.regUsersForAdding, function (contact) {
          return contact.mobilenumber === userData.mobilenumber
        });

        if(contactIndex < 0) {
          $scope.regUsersForAdding.push(userData);
        }
      } else {
        contactIndex = _.findIndex($scope.regUsersForAdding, function (contact) {
          return contact.mobilenumber === userData.mobilenumber
        });

        if(contactIndex > -1) {
          $scope.regUsersForAdding.splice(contactIndex, 1);
        }
      }

      //updating cached users
      indexInRegContacts = _.findIndex(registeredContacts, function (contact) {
        return contact.mobilenumber === userData.mobilenumber
      });

      if(indexInRegContacts > -1) {
        registeredContacts[indexInRegContacts].checked = userData.checked;
      }
    };

    function _getRegisteredUsers(numbers) {
      SettingsService.getContacts(numbers)
        .then(function(res) {
          var clearedNumber, i;

          if(res.status === "success") {
            $scope.regUsers  = res.users;
            console.log('$scope.regUsers', $scope.regUsers);




            registeredContacts = JSON.parse(JSON.stringify(res.users));

            res.users.forEach(function(user) {

              //filtering contacts for removing existed users
              for (i = $scope.contacts.length - 1; i >= 0; i--) {
                clearedNumber = $scope.contacts[i].mobilenumber.replace(/[^0-9\+]/g, "");

                if(userData.mobilenumber === clearedNumber) {
                  $scope.contacts.splice(i, 1);
                  break;
                }

                if(clearedNumber === user.mobilenumber) {
                  $scope.contacts.splice(i, 1);
                  break;
                }
              }

            });

            $timeout(function () {
              $ionicLoading.hide();
            }, 300);
          } else {
            window.plugins.toast.showShortCenter(res.message, function (a) {
              },
              function (b) {
                alert(res.message)
              });
          }
        })
        .catch(function(err) {
          $timeout(function () {
            $ionicLoading.hide();
          }, 200);
        });
    }

    function createNumbersWithCountryCode(baseNumber) {
      var firstPart;
//      console.log('userCountryCode', userCountryCode);
      var countryCodeParts = userCountryCode.split(''),
        newNumbers = countryCodeParts.map(function(part, index) {
          if(index === 0) {
            firstPart = part;
          } else {
            firstPart = firstPart + part;
          }
          return firstPart + baseNumber;
        });

      return newNumbers;
    }

    $scope.openChat = function(partnerInfo) {
      UserService.setPartnerData(partnerInfo);

      $state.go("app.chat", {partner_number: partnerInfo.mobilenumber});
    };

    $scope.createTriby = function () {
      if(creatingIsInProgress) {
        return;
      }

      creatingIsInProgress = true;
      var selectedContacts = _.where($scope.contacts, {checked: true});
      var selectedUsers = _.where($scope.regUsersForAdding, {checked: true});
      var allSelected = selectedContacts.concat(selectedUsers);
      var triby = FeedService.getNewTriby();

      triby.members = [];
      triby.memberContacts = [];
      $scope.disableCreateBtn = true;

      if(allSelected && allSelected.length > 0) {
        _.each(allSelected, function (contact) {
          var mobilenumber = contact.mobilenumber.replace(/[^0-9\+]/g, "");

          /**
           * Check number if it isn't in international format add current device country code
           */
            //if (!CountryCodeService.isInternationalNumber(mobilenumber) && _.isString($scope.currentPhoneCode) && $scope.currentPhoneCode.length) {
            //  mobilenumber = $scope.currentPhoneCode + mobilenumber;
            //}

          triby.members.push(mobilenumber);
          triby.memberContacts.push({
            mobilenumber: mobilenumber,
            name: contact.name || '',
            pic: contact.pic || ''
          });
        });
      }

      var callback  = function () {
        FeedService.saveTriby(triby).then(function (response) {

          function postProcessing() {
            $ionicLoading.hide();
            window.plugins.toast.showShortCenter("New Triby created successfully", function (a) {
              console.log('toast success: ' + a)
            }, function (b) {
              alert('toast error: ' + b)
            });

            $timeout(function () {
              $state.go('app.main.home');
            }, 100);

            creatingIsInProgress = false;
          }

          if (response.status == "success") {
            if (response.usersToInvite !== undefined && response.usersToInvite.length > 0) {
              $cordovaSms
                .send(response.usersToInvite.join(', '), smsText, {android: {intent: 'INTENT'}})
                .then(function () {
                  console.log('sms: send');
                  postProcessing();
                }, function (error) {
                  $scope.disableCreateBtn = false;
                  postProcessing();
                  console.log('sms: error:' + error);
                });
            } else {
              postProcessing();
            }
          }
          else {
            creatingIsInProgress = false;
            window.plugins.toast.showShortCenter(response.message, function (a) {
              console.log('toast success: ' + a)
            }, function (b) {
              alert('toast error: ' + b)
            });
          }
        }).catch(function (error) {
          creatingIsInProgress = false;
          $scope.disableCreateBtn = false;
          window.plugins.toast.showShortCenter(error, function (a) {
            console.log('toast success: ' + a)
          }, function (b) {
            alert('toast error: ' + b)
          });
        });
      };

      var parallels = {};

      _.each(triby.memberContacts, function(contact) {
        if (contact.pic) {
          parallels[ contact.mobilenumber ] = function(callback) {
            SettingsService.uploadImage(contact.pic, contact.name).then(function(data) {
              callback(null, data);
            }).catch(function(err) {
              callback(null);
            })
          }
        }
      });


      if (_.size(parallels)) {
        async.parallel(parallels, function(err, data) {
          var contact,index;

          _.each(data, function(item, mobilenumber) {
            if (_.isObject(item)) {
              contact = _.findWhere(triby.memberContacts, {mobilenumber: mobilenumber});
              index = _.indexOf(triby.memberContacts, contact);
              triby.memberContacts[index].pic = item.url_file;
            }
          });

          callback();
        });
      } else {
        callback();
      }
    };

    // go to triby info page
    $scope.goBack = function () {
      $ionicLoading.show({
        template: '<p> Loading </p><i class="icon ion-loading-c"></i>'
      });

      $timeout(function () {
        if(history.length > 1) {
          history.back();
        } else {
          $state.go("app.chats");
        }

        $timeout(function() {
          $ionicLoading.hide();
        }, 300)
      }, 20);
    };

  }]);


