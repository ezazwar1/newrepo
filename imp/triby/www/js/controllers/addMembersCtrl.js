'use strict';
MyApp.controller('AddMembersCtrl', ['$scope',
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

  $scope.contacts = [];
  $scope.regUsers = [];
  $scope.regUsersForAdding = [];
  $scope.invitesLength = 0;
  $scope.query='';

  //var smsText = 'Let\'s chat on "Triby Messenger". You can delete your sent messages and posts from everyone\'s phone in real time. Download it Free @ http://triby.co/dl';
  var smsText = 'Add me on Triby! http://triby.co/dl';
  var checkingTimeout = 50;
  var checkingTimeoutFinished = true;
  var registeredContacts = [];
  var userData = UserService.getAuthData(),
    userCountryCode;

  $scope.$on('$ionicView.leave', function(){
    $ionicLoading.hide();
  });

  //getting user country for adding it to the numbers that has not country code for detecting registered users on the server
  CountryCodeService.getCurrentCountryCode(function(result){
    if(result.status === 'success') {
      userCountryCode = result.currentCountryCode;
    } else {
      userCountryCode = '+';
    }
  }, userData.country);

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

    var usersToInvite = selectedContacts.map(function(contact) {
      return contact.mobilenumber.replace(/[^0-9\+]/g, "");
    });

    $ionicLoading.hide();

    $cordovaSms
      .send(usersToInvite.join(', '), smsText, {android: {intent: 'INTENT'}})
      .then(function () {
        $timeout(function () {
          $ionicLoading.hide();
          $ionicHistory.backView();
        }, 20);
      }, function (error) {
        $timeout(function () {
          $ionicLoading.hide();
          $ionicHistory.backView();
        }, 20);
      })
      .catch(function(err) {
        $timeout(function () {
          $ionicLoading.hide();
          $ionicHistory.backView();
        }, 20);
      });
  };

  $ionicLoading.show({
    template: '<p> Loading </p><i class="icon ion-loading-c"></i>'
  });

  var triby = FeedService.getNewTriby();

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

    data.contacts.forEach(function(contact) {
      var mobilenumber = contact.mobilenumber.replace(/[^0-9\+]/g, ""),
        matchedCleanNumber = false;

      contactsNumbers.push(mobilenumber);
      var match = mobilenumber.match(/\d{10}$/);
      var numberWithoutCountryCode = false;
      if (match && match[0]) {
        numberWithoutCountryCode = match[0];
        matchedCleanNumber = _.find(triby.members, function (memberNumber) {
          return new RegExp(numberWithoutCountryCode+'$').test(memberNumber)
        });

      }

      if (mobilenumber[0] !== '+') {
        additionalNumbers = additionalNumbers.concat(createNumbersWithCountryCode(numberWithoutCountryCode));
      }

      if (!matchedCleanNumber) {
        $scope.contacts.push(contact);
      }
    });

    _getRegisteredUsers(contactsNumbers.concat(additionalNumbers));
  });

  function createNumbersWithCountryCode(baseNumber) {
    var firstPart;
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

  function _getRegisteredUsers(numbers) {
    SettingsService.getContacts(numbers)
      .then(function(res) {
        var i, clearedNumber;

        if(res.status === "success") {

          $scope.regUsers  = res.users.map(function(user) {
            if (triby.members.indexOf(user.mobilenumber)  > -1) {
              user.checked = true;
            } else {
              user.checked = false;
            }

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

            return user;
          });

          registeredContacts = JSON.parse(JSON.stringify($scope.regUsers));

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
        window.plugins.toast.showShortCenter(err || 'Server error', function (a) {
          },
          function (b) {
            alert(err || 'Server error')
          });
      });
  }

  $scope.searchByProfileName = function(profileName) {
    if(!profileName || profileName === '') {
      return $scope.regUsers = registeredContacts;
    } else if(profileName.length < 2) {
      return $scope.regUsers = [];
    }

    UserService.searchByProfileName(profileName, triby.members).then(function(result) {
      if(result) {
        if(result.data.status === 'success') {
          if(result.data.users.length) {
            //$scope.regUsers = result.data.users;
            $scope.regUsers = result.data.users.map(function(contact) {
              var contactIndex = _.findIndex($scope.regUsersForAdding, function (existingContact) {
                return contact.mobilenumber === existingContact.mobilenumber
              });

              if(contactIndex > -1) {
                contact.checked = true;
              }
              console.log('add Members contact', contact);
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

  $scope.openChat = function(partnerInfo) {
    UserService.setPartnerData(partnerInfo);

    $state.go("app.chat", {partner_number: partnerInfo.mobilenumber});
  };

  $scope.updateUsersForAdding = function(userData) {
    var contactIndex;

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

  };

  // update triby
  $scope.updateTriby = function () {
    var selectedContacts = _.where($scope.contacts, {checked: true}),
        members = [],
        memberContacts = [],
        newMembersPhoneNumbers = [],
        selectedUsers = _.where($scope.regUsersForAdding, {checked: true}),
        allSelected = selectedContacts.concat(selectedUsers);

    _.each(allSelected, function (contact) {
      var cleanPhoneNumber = contact.mobilenumber.replace(/[^0-9\+]/g, "");

      members.push(cleanPhoneNumber);

      memberContacts.push({
        mobilenumber: cleanPhoneNumber,
        name: contact.name || '',
        pic: contact.pic || ''
      });
    });

    _.each(selectedContacts, function (contact) {
      var cleanPhoneNumber = contact.mobilenumber.replace(/[^0-9\+]/g, "");

      if (contact.selectedBefore === undefined || !contact.selectedBefore) {
        newMembersPhoneNumbers.push(cleanPhoneNumber);
      }
    });

    $ionicLoading.show({
      template: '<p> Loading </p><i class="icon ion-loading-c"></i>'
    });

    var callback = function() {
      FeedService.updateMembers(triby._id, {
        users: members,
        memberContacts: memberContacts,
        newMembersPhoneNumbers: newMembersPhoneNumbers
      }).then(function (response) {
        console.log(JSON.stringify(response));

        function postProcessing() {
          $ionicLoading.hide();
          window.plugins.toast.showShortCenter("Changes saved. successfully", function (a) {
            console.log('toast success: ' + a)
          }, function (b) {
            alert('toast error: ' + b)
          });

          $timeout(function () {
            $state.go("app.info", {triby_id: triby._id});
          }, 100);
        }

        if (response.status == "success") {
          if (response.usersToInvite !== undefined && response.usersToInvite.length > 0) {
            $cordovaSms
              .send(response.usersToInvite.join(', '), smsText, {android: {intent: 'INTENT'}})
              .then(function () {
                console.log('sms: send');
                postProcessing();
              }, function (error) {
                postProcessing();
                console.log('sms: error:' + error);
              });
          } else {
            postProcessing();
          }
        }
        else {
          window.plugins.toast.showShortCenter(response.message, function (a) {
            console.log('toast success: ' + a)
          }, function (b) {
            alert('toast error: ' + b)
          });
          $ionicLoading.hide();
        }
      }).catch(function (error) {
        window.plugins.toast.showShortCenter(error, function (a) {
          console.log('toast success: ' + a)
        }, function (b) {
          alert('toast error: ' + b)
        });
        $ionicLoading.hide();
      });
    };

    var parallels = {};

    _.each(memberContacts, function(contact) {
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
        var contact,
            index;

        _.each(data, function(item, mobilenumber) {
          if (_.isObject(item)) {
            contact = _.findWhere(memberContacts, {mobilenumber: mobilenumber});
            index = _.indexOf(memberContacts, contact);
            memberContacts[index].pic = item.url_file;
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
    $timeout(function () {
      history.back();
    }, 100);
  }
}]);

