// Ionic Starter App
'use strict';
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var MyApp = angular.module('MyApp', [
  'ionic',
  'LocalStorageModule',
  'jrCrop',
  'ngRoute',
  'ngCordova',
  'pubnub.angular.service',
  'monospaced.elastic',
  'ngSanitize',
  'ngIOS9UIWebViewPatch',
  'Tek.progressBar'
]);

MyApp.config(['$ionicConfigProvider','$compileProvider','$sceDelegateProvider', function ($ionicConfigProvider,$compileProvider,$sceDelegateProvider){
  $ionicConfigProvider.tabs.style('standard');
  $ionicConfigProvider.tabs.position('bottom');
  $ionicConfigProvider.views.transition('none');
  $ionicConfigProvider.navBar.alignTitle('center');
  $ionicConfigProvider.navBar.positionPrimaryButtons('left');
  $ionicConfigProvider.navBar.positionSecondaryButtons('right');
  // Set the whitelist for certain URLs just to be safe
  $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel|data|http|blob):/);
  $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|file|blob|content):|data:image\//);

  $sceDelegateProvider.resourceUrlWhitelist(['self', new RegExp('^(http[s]?):\/\/(w{3}.)?youtube\.com/.+$'),'http://triby-dev.s3.amazonaws.com/**', 'https://triby-dev.s3.amazonaws.com/**']);
}]);

MyApp.constant('LOW_INTERNET_TIMEOUT', 5*1000);

MyApp.config(function($stateProvider, $urlRouterProvider, $httpProvider) {
  $stateProvider.state('signup', {
    url: '/signup',
    templateUrl: 'templates/signup.html'
  })
    .state('signup_step1', {
      url: '/signup_1',
      templateUrl: 'templates/signup-step-1.html'
    })
    .state('signup_step3', {
      url: '/signup_3',
      templateUrl: 'templates/signup-step-3.html'
    })
    .state('confirm', {
      url: '/confirm',
      templateUrl: 'templates/signup-step-2.html'
    })
    .state('app', {
      url: '/app',
      //abstract: true,
      templateUrl: 'templates/container.html',
      controller: 'AppCtrl'
    })
    .state('app.main', {
      url:'/main',
      views: {
        'menuContent' :{
          templateUrl: 'templates/main.html',
          controller: 'AppCtrl'
        }
      }
    })
    .state('app.main.home', {
      url:'/home',
      views: {
        'tab-home' :{
          templateUrl: 'templates/home.html',
          controller:'HomeCtrl'
        }
      },
      resolve: {
          FeedService: 'FeedService',
          tribes : function(FeedService, $stateParams, $ionicLoading, $q, $rootScope){
              $ionicLoading.show({
                template: '<p> Loading </p> <i class="icon ion-loading-c"></i>'
              });
              var deffered = $q.defer();


              FeedService.getTribes().then(function(response){
                //sometimes when new pubnub subscription made info lost (specially for unread service)
                var unreadCounter = 0;
                if(response.data.status === "success") {
                  if (response.data.tribes && response.data.tribes.length > 0) {
                    for (var i = 0; i < response.data.tribes.length; i++) {
                      if (response.data.tribes[i].unreadNotifications && response.data.tribes[i].unreadNotifications > 0) {
                        unreadCounter = unreadCounter + response.data.tribes[i].unreadNotifications;
                      }
                    }
                  }
                  $rootScope.unreadGroupsNotifications = unreadCounter;
                }

                deffered.resolve(response);
                $ionicLoading.hide();
              }, function(err){
                  deffered.reject(err);
                  $ionicLoading.hide();
              });


              return deffered.promise;
          }
      }
    })
    .state('app.noti', {
      url:'/noti',
      views: {
        'menuContent' :{
          templateUrl: 'templates/noti.html',
          controller:'NotificationCtrl'
        }
      }
    })
    .state('app.settings', {
      url: '/settings/:prevPage',
      views: {
        'menuContent': {
          templateUrl: 'templates/setting.html'
        }
      }
    })
    .state('app.news_feed', {
      url: '/news_feed/:triby_id(/post/:post_id)',
      views: {
        'menuContent': {
          templateUrl: 'templates/news_feed.html',
          controller: "FeedCtrl"
        }
      },
      resolve: {
          FeedService: 'FeedService',
          triby : function(FeedService, $stateParams, $ionicLoading, $q){
              $ionicLoading.show({
                template: '<p> Loading </p> <i class="icon ion-loading-c"></i>'
              });
              var deffered = $q.defer();

              FeedService.getTriby($stateParams.triby_id, {postId: $stateParams.post_id}).then(function(response){
                  deffered.resolve(response);
              }, function(err){
                $ionicLoading.hide();

                window.plugins.toast.showShortCenter("Can't get this group", function (a) {
                }, function (b) {
                  alert("Can't get this group");
                });

                deffered.reject(err);
              });
              return deffered.promise;
          }
      }
    })
    .state('app.comments', {
      url: '/comments/:post_id(/comment/:comment_id)',
      params : { triby: null },
      views: {
        'menuContent': {
          templateUrl: 'templates/comments.html',
          controller:"CommentsCtrl"
        }
      }
    })
    .state('app.comments_side', {
      url: '/comments_side/:sidechat_id/:user_id',
      views: {
        'menuContent': {
          templateUrl: 'templates/comments_side.html',
          controller:"ChatCtrl"
        }
      }
    })
    .state('app.chat', {
      url: '/chat/:partner_number?unread_messages&chatId',
      views: {
        'menuContent': {
          templateUrl: 'templates/chat.html',
          controller: 'ChatCtrl',
          params: {
            chatName: null
          }
        }
      }
    })
    .state('app.chats', {
      url: '/chats',
      views: {
        'menuContent': {
          templateUrl: 'templates/chats.html',
          controller: 'ChatsCtrl'
        }
      }
    })
    .state('app.add_members', {
      url: '/add_members',
      views: {
        'menuContent': {
          templateUrl: 'templates/add_members.html',
          controller: 'AddMembersCtrl'
        }
      }
    })
    .state('app.new_triby', {
      url: '/new_triby',
      views: {
        'menuContent': {
          templateUrl: 'templates/new_triby.html'
        }
      }
    })
    .state('app.add_people', {
      url: '/add_people',
      views: {
        'menuContent': {
          templateUrl: 'templates/add_people.html'
        }
      }
    })
    .state('app.contacts_page', {
      url: '/contacts_page',
      views: {
        'menuContent': {
          templateUrl: 'templates/contacts_page.html'
        }
      }
    })
    .state('app.add_chats', {
      url: '/add_chats',
      views: {
        'menuContent': {
          templateUrl: 'templates/contacts_page.html'
        }
      }
    })
    .state('app.search', {
      url: '/search',
      views: {
        'menuContent': {
          templateUrl: 'templates/search.html',
          controller: "HomeCtrl"
        }
      },
      resolve: {
          FeedService: 'FeedService',
          tribes : function(FeedService, $stateParams, $ionicLoading, $q){
              $ionicLoading.show({
                template: '<p> Loading </p> <i class="icon ion-loading-c"></i>'
              });
              var deffered = $q.defer();
              FeedService.getTribes().then(function(response){
                  deffered.resolve(response);
                  $ionicLoading.hide();
              }, function(err){
                  deffered.reject(err);
                  $ionicLoading.hide();
              });
              return deffered.promise;
          }
      }
    })
    .state('app.tribys', {
      url: '/tribys',
      views: {
        'menuContent': {
          templateUrl: 'templates/tribys.html'
        }
      }
    })
    .state('app.info', {
      url: '/info/:triby_id/:triby_name',
      views: {
        'menuContent': {
          templateUrl: 'templates/info.html'
        }
      }
    })
    .state('app.edit_info', {
      url: '/edit_info/:triby_id',
      views: {
        'menuContent': {
          templateUrl: 'templates/edit_info.html'
        }
      }
    })
    .state('app.profile', {
      url: '/profile',
      views: {
        'menuContent': {
          templateUrl: 'templates/profile.html'
        }
      }
    })
    .state('app.account', {
      url: '/account',
      views: {
        'menuContent': {
          templateUrl: 'templates/account.html'
        }
      }
    })
    .state('app.change_number', {
      url: '/change_number',
      views: {
        'menuContent': {
          templateUrl: 'templates/change_number.html'
        }
      }
    })
    .state('app.delete_account', {
      url: '/delete_account',
      views: {
        'menuContent': {
          templateUrl: 'templates/delete_account.html'
        }
      }
    })
    .state('app.notifications', {
      url: '/notifications',
      views: {
        'menuContent': {
          templateUrl: 'templates/notifications.html'
        }
      }
    })
    .state('app.feedback', {
      url: '/feedback',
      views: {
        'menuContent': {
          templateUrl: 'templates/feedback.html'
        }
      }
    })
    .state('app.terms', {
      url: '/terms',
      views: {
        'menuContent': {
          templateUrl: 'templates/terms.html'
        }
      }
    })
    .state('app.about', {
      url: '/about',
      views: {
        'menuContent': {
          templateUrl: 'templates/about.html'
        }
      }
    })
    .state('app.mural', {
      url: '/mural/:triby_id/:triby_name',
      views: {
        'menuContent': {
          templateUrl: 'templates/mural.html',
          controller: 'MuralCtrl'
        }
      }
    })
    .state('mural_details', {
      url: '/mural_details',
      templateUrl: 'templates/mural_details.html'
    })
    .state('app.main.no_connection', {
      url:'/no_connection',
      views: {
        'tab-home' :{
          templateUrl: 'templates/no_connection.html',
          controller:'AppCtrl'
        }
      },
      onEnter: function ($ionicLoading) {
        $ionicLoading.hide();
      }
    })
   .state('app.server_connection_error', {
      url:'/server_connection',
      views: {
          'menuContent' :{
              templateUrl: 'templates/server_connection_error.html'
          }
      },
      onEnter: function ($ionicLoading) {
        $ionicLoading.hide();
      }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/signup');

  //$httpProvider.interceptors.push('badConnectionInterceptor');
});

MyApp.factory('badConnectionInterceptor', function ($rootScope, $q, $injector, lowInternetService) {
  function _get_random_id() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }

    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4();
  }

  return {
    request: function (config) {
      config.timeoutName = _get_random_id();
      lowInternetService.addListener(config.timeoutName);

      return config;
    },
    responseError: function (rejection) {
      lowInternetService.cleanAllListeners();

      return $q.reject(rejection);
    },

    response: function(response) {
      var timeoutName = response.config.timeoutName;

      lowInternetService.removeListener(timeoutName);

      return response;
    }
  }
});

MyApp.run(function ($timeout,
                    $rootScope,
                    $window,
                    $state,
                    $document,
                    $cordovaSplashscreen,
                    $cordovaDevice,
                    $ionicPlatform,
                    $ionicPopup,
                    $ionicLoading,
                    NotificationService,
                    SettingsService,
                    ConfigService,
                    UserService,
                    FeedService,
                    CountryCodeService,
                    UnreadNotificationsService,
                    $http,
                    _) {


//console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!', SettingsService);
//comment:"555",
//  pic:"",
//  post:"57cfc7440ea700461f1b053b",
//  tribe:"57cddf520ea700461f1b048b",
//  user:{
//    _id:"57c94372677df21b418a5ac2",
//    country:"Ukraine",
//    id:"57c94372677df21b418a5ac2",
//    isAuth:true,
//    mobilenumber:"+380500871935",
//    pic:"http://triby-dev.s3.amazonaws.com/avatar_1472811612309.jpg",
//    token:"456e7640-8b4f-4dc1-8881-70ec6496408e",
//    type:"mobile",
//    username:"Gebriel13"
//    }

//
var dataASD = {_temp_local_id:"6e3d69b1-992d-b20d-1f43-c9f947f7f158",
  comment:"555",
  pic:"",
  post:"57cfc7440ea700461f1b053b",
  tribe:"57cddf520ea700461f1b048b",
  user:{
    _id:"57c94372677df21b418a5ac2",
    country:"Ukraine",
    id:"57c94372677df21b418a5ac2",
    isAuth:true,
    mobilenumber:"+380500871935",
    pic:"http://triby-dev.s3.amazonaws.com/avatar_1472811612309.jpg",
    token:"456e7640-8b4f-4dc1-8881-70ec6496408e",
    type:"mobile",
    username:"Gebriel13"
    }
  }





  var array = [];
  var contactsNumbers = [];
    var additionalNumbers = [];
    var ASD = [];

// setInterval( function() {
////   window.plugins.toast.showShortCenter(' Joined Triby', function (a) {
////                          console.log('toast success: !!!!!!!!!!!1' + a)
////                        }, function (b) {
////                          alert('toast error: !!!!!!!!!!!!!!!1' + b)
////                        });
//                        var userAuth = UserService.getAuthData();
//console.log('!!!!!!!!!!!!!!!!!!1',userAuth)
//// var deferred = $q.defer();
//
// var asd2 = {_id:"57c9ec3a677df21b418a5bc7",
//              country:"Ukraine",
//              mobilenumber:"+380502695672",
//              nameInsensitive:"ttt",
//              pic:"http://triby-dev.s3.amazonaws.com/avatar_1472850991331.jpg",
//              profilename:"Ttt",
//              status:1,
//              username:"Ttt"}
//
//var ASD = {
//// temp_local_id:"6a7016f7-2179-b64c-1791-490c09f6055f",
//  userId:'57c9ec3a677df21b418a5bc7',
// chat:"57d04ed80ea700461f1b05c6",
// message: userAuth.username +" User Added",
// recipientId:userAuth.id,
// userPic:userAuth.id,
// userName: 'Ass',
//
//  user:{username: "Ttt", userPic: "http://triby-dev.s3.amazonaws.com/avatar_1472850991331.jpg"}
//}
//
////                          var notificationData = {
////                              "user_id": '57c84521bdbdad48576ef962'
////                          };
//
//
//          $http.post($rootScope.urlBackend + '/v3/messages', ASD).success(function(response) {
////                          $http.post($rootScope.urlBackend + '/v3/heart', ASD).success(function(response) {
//
//          console.log('response', response);
//
//                var parent_id = response.message.chat
//                var message_id = response.message._id
//                var parent = {partnerId:response.message.chat}
//                $http.patch($rootScope.urlBackend + '/v3/messages/' + message_id+  '?partnerId'+ parent_id , parent).success(function(response) {
//      //                          $http.post($rootScope.urlBackend + '/v3/heart', ASD).success(function(response) {
//
//                console.log('response', response);
//
//
//
//      //                              deferred.resolve(response);
//                }).error(function(err, status) {
//
//                    console.log('err', err)
//      //                              deferred.reject(err);
//                });
//
//
////                              deferred.resolve(response);
//          }).error(function(err, status) {
//
//              console.log('err', err)
////                              deferred.reject(err);
//          });
// },20000)


//setTimeout(function(){
//
//      setInterval( function() {
//
//      SettingsService.getPhoneContacts().then(function (phoneContacts) {
//
//                  console.log('phoneContacts', phoneContacts);
//                var contacts = _.sortBy(phoneContacts, 'name');
////                console.log('contacts', contacts);
//                 ASD = _.map(contacts, function (contact) {
//                    var mobilenumber = contact.mobilenumber.replace(/[^0-9\+]/g, "");
//                    contactsNumbers.push(mobilenumber);
//
//                    if(mobilenumber[0] !== '+') {
//                      additionalNumbers = additionalNumbers.concat(createNumbersWithCountryCode(mobilenumber));
//                    }
//
//                    return contact;
//                  });
//              })
//
////              console.log('additionalNumbers', additionalNumbers);
////              console.log('contactsNumbers.concat(additionalNumbers)', contactsNumbers.concat(additionalNumbers));
//
//              if(contactsNumbers.concat(additionalNumbers).length > 0){
//                 _getRegisteredUsers(contactsNumbers.concat(additionalNumbers));
//                   contactsNumbers = [];
//                   additionalNumbers = [];
//              }
//
//
//      } , 20000)
//
//}, 5000)

var result = [];
var counter = 0;

//function createNumbersWithCountryCode(baseNumber) {
//
//
//
//var   contactsNumbers = [],
//      userData = UserService.getAuthData(),
//      userCountryCode
//
//
////      console.log('userData', userData);
//
//    //getting user country for adding it to the numbers that has not country code for detecting registered users on the server
//    CountryCodeService.getCurrentCountryCode(function(result){
//      if(result.status === 'success') {
//        userCountryCode = result.currentCountryCode;
//      } else {
//        userCountryCode = '+';
//      }
//    }, userData.country);
//
//
//      var firstPart;
//      var countryCodeParts = userCountryCode.split(''),
//        newNumbers = countryCodeParts.map(function(part, index) {
//          if(index === 0) {
//            firstPart = part;
//          } else {
//            firstPart = firstPart + part;
//          }
//          return firstPart + baseNumber;
//        });
//
//      return newNumbers;
//    }

  function _getRegisteredUsers(numbers) {
        SettingsService.getContacts(numbers)
          .then(function(res) {
            var clearedNumber, i;

            if(res.status === "success") {
//              $scope.regUsers  = res.users;
                if(counter == 0){
                  result = res.users;
                  counter++;
//                  $rootScope.showNBanner(res.users[0]);
                }else{

                  console.log('res.users', res.users);
//                  console.log('result', result);

                  Array.prototype.diff = function(a) {
                      return this.filter(function(i) {return a.indexOf(i) < 0;});
                  };





                  if(result.length !== res.users.length){
//                    res.users[res.users.length - 1];



                      var one = [], two = [];
                      result.forEach(function(e){
                        one.push(e._id);
                      })

                      res.users.forEach(function(e){
                        two.push(e._id);
                      })

                      var newContact = res.users[two.indexOf(two.diff(one)[0])];

                      console.log('newContact', newContact);




                       var message = {};
                        message.id = newContact._id;
                        message.username = newContact.username;
                        message.avatarSrc = newContact.pic;
                        message.message = newContact.mobilenumber;
                        message.url = 'app.contacts_page';

                       $rootScope.showNBanner(message);

                        var userAuth = UserService.getAuthData();
//                        console.log("userAuth!!!!!!!!!!!!!!!!!!!!!!!!", userAuth);
                       var ASD = {
                        temp_local_id:"6a7016f7-2179-b64c-1791-490c09f6055f",

                        chat:"57d04ed80ea700461f1b05c7",
                        message: "#"+message.username + " user added",
                        recipientId:userAuth.id,

                         user:{username: newContact.username, pic: newContact.pic}
                       }

//                       var notificationData = {
//                           "user_id": '57c84521bdbdad48576ef962'
//                       };
                       $http.post($rootScope.urlBackend + '/v3/messages', ASD).success(function(response) {
//                          $http.post($rootScope.urlBackend + '/v3/heart', ASD).success(function(response) {

                       console.log('response', response);
//                              deferred.resolve(response);
                       }).error(function(err, status) {

                           console.log('err', err)
//                              deferred.reject(err);
                       });


//                      window.plugins.toast.showShortCenter(message.username + ' Joined Triby', function (a) {
//                        console.log('toast success: !!!!!!!!!!!1' + a)
//                      }, function (b) {
//                        alert('toast error: !!!!!!!!!!!!!!!1' + b)
//                      });

                      result = res.users;

                  }

//                   $scope.$broadcast('slide:show', res.users[res.users.length - 1]);
//                [
//                  {
//                    "_id": "57c93479677df21b418a5abd",
//                    "pic": "http://triby-dev.s3.amazonaws.com/avatar_1472803959304.jpg",
//                    "country": "Ukraine",
//                    "mobilenumber": "+380638277105",
//                    "profilename": "SPRO",
//                    "username": "Nastya",
//                    "status": 1,
//                    "nameInsensitive": "nastya"
//                  },
//                  {
//                    "_id": "57c9e5a2677df21b418a5bb7",
//                    "pic": "http://triby-dev.s3.amazonaws.com/avatar_1472849160534.jpg",
//                    "country": "Ukraine",
//                    "mobilenumber": "+380502787805",
//                    "profilename": "Qqqq",
//                    "username": "Qqq",
//                    "status": 1,
//                    "nameInsensitive": "qqq"
//                  },
//                  {
//                    "_id": "57c9ec3a677df21b418a5bc7",
//                    "pic": "http://triby-dev.s3.amazonaws.com/avatar_1472850991331.jpg",
//                    "country": "Ukraine",
//                    "mobilenumber": "+380502695672",
//                    "profilename": "Ttt",
//                    "username": "Ttt",
//                    "status": 1,
//                    "nameInsensitive": "ttt"
//                  }
//                ]






                }
//              if (res.users !== result){
//                 console.log('$scope.regUsers!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1', res.users);
//                var onlyInA = result.filter(function(current){
//                    return res.users.filter(function(current_b){
//                        return current_b.value == current.value && current_b.display == current.display
//                    }).length == 0
//                });
//
//                var onlyInB = res.users.filter(function(current){
//                    return result.filter(function(current_a){
//                        return current_a.value == current.value && current_a.display == current.display
//                    }).length == 0
//                });
//                console.log('onlyInA', onlyInA);
//                console.log('onlyInB', onlyInB);
//                if(onlyInB.length > 0){
//                 result = onlyInA.concat(onlyInB);
//                }else {
//                 result = res.users;
//                }
//
//              }else {
//
//              }




            } else {
              window.plugins.toast.showShortCenter(res.message, function (a) {
                },
                function (b) {
                  alert(res.message)
                });
            }
          })
          .catch(function(err) {

          });
      }



  ionic.Platform.setGrade('c');

  if (!String.prototype.endsWith) {
    String.prototype.endsWith = function(searchString, position) {
      var subjectString = this.toString();
      if (typeof position !== 'number' || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length) {
        position = subjectString.length;
      }
      position -= searchString.length;
      var lastIndex = subjectString.indexOf(searchString, position);
      return lastIndex !== -1 && lastIndex === position;
    };
  }

  $rootScope.params = {count: 0};
  $rootScope.params.increment = function () {
    $rootScope.params.count++;
  };

  $rootScope.progressBar = {
    val: 0
  };

  $rootScope.authData = null;
  $rootScope.unreadMessages = 0;
  $rootScope.unreadGroupsNotifications = 0;
  $rootScope.noConnection = false;

  $rootScope.urlBackend = ConfigService.backendUrl;
  $rootScope.s3Url = ConfigService.s3Url;

  $rootScope.Get_Width = function (index) {
    if (index % 3 == 0)
      return '100%';
    else
      return '50%';
  };

  $rootScope.reload = function () {
    if (navigator.connection.type !== Connection.NONE) {
      $rootScope.noConnection = false;
      UserService.restoreLastScreen();
    }
  };

  $rootScope.isShowNBanner = false;

  $rootScope.showNBanner = function (data) {

   var userAuth = UserService.getAuthData();

         console.log('showNBanner!!!!!!!!!!!!', data);
            $rootScope.nBannerData = data;

            //$rootScope.$apply(function(){
            //  $rootScope.isShowNBanner = true;
            //});

            $timeout(function () {
              $rootScope.isShowNBanner = true;
            }, 5);

            $timeout(function () {
              $rootScope.isShowNBanner = false;
            }, 3000);


  };

  $rootScope.goToEventTarget = function (eventId, eventUrl, eventUrlParams) {
    //we have not notifications for messages, so we don't need to set them as viewed
    //if(eventId) {
    //  NotificationService.markAsViewed(eventId);
    //}
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      $rootScope.isInCommentingMode = false;
    }
    $rootScope.isShowNBanner = false;
    if (eventUrl) {
      $state.go(eventUrl, eventUrlParams);
    }
  };

  $rootScope.pubnubInstanceDEBUG = function() {
    void 0;
  };

  $rootScope.debugInfo = function (data) {
    //console.log('debugInfo: ', data);
  };

  $rootScope.Get_PaddingLeft = function (index) {
    if (index % 3 == 0 || index % 3 == 1)
      return '0px';
    else
      return '3px';
  };

  //$ionicPlatform.registerBackButtonAction(function (event) {
  //
  //  $ionicLoading.hide();
  //
  //  if ($state.current.name == "app.main.home") {
  //    navigator.app.exitApp();
  //  }
  //  else {
  //    navigator.app.backHistory();
  //  }
  //  event.preventDefault();
  //  return false;
  //}, 101);

  $ionicPlatform.registerBackButtonAction(function(event) {
    if(!$rootScope.noConnection) {
      $ionicLoading.hide();
      window.history.back();
    }

    event.preventDefault();
    return false;
  }, 140);

  $ionicPlatform.on('resume', function () {
    UserService.restoreAuth().then(function (authData) {
      UnreadNotificationsService.restoreIfBroken();
      NotificationService.initPushwoosh().then(function (pushToken) {
          SettingsService.updateDevice({"pushwooshtoken": pushToken});
        },
        function (error) {
          if (!_.isUndefined(error.type) && error.type == 'no_device') {
            $rootScope.debugInfo({'m': 'on resume error:', 'd': error});
            // message: "{\"error\":\"Error Domain=NSCocoaErrorDomain Code=3010
            // \\"REMOTE_NOTIFICATION_SIMULATOR_NOT_SUPPORTED_NSERROR_DESCRIPTION\\"
            // UserInfo={NSLocalizedDescription=REMOTE_NOTIFICATION_SIMULATOR_NOT_SUPPORTED_NSERROR_DESCRIPTION}\"}"

          }
        }, function (error) {
          console.log('Can\'t register for push notifications', error);
        });

      NotificationService.checkBadgesConsistency();

      //we have not notifications tab now
      //NotificationService.updateUnreadNotificationsCount();
    },
    function (error) {
      console.log('error on restore auth 0: ', error);
    });
  });

  $ionicPlatform.ready(function () {
    if (window.cordova) {
      if (ConfigService.isDebug) {
        $window.analytics.debugMode();
      }

      $window.analytics.startTrackerWithId(ConfigService.googleAnalyticsTrackingCode);

      $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
        $window.analytics.trackView(toState.name);

        if(!fromState.name || fromState.name === '' || new RegExp('signup').test(fromState.name)) {
          return;
        }

        UnreadNotificationsService.restoreIfBroken();
        UserService.setLastScreen(window.location.hash);
      });
    }

    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      StatusBar.overlaysWebView(true);
      StatusBar.styleLightContent();
      StatusBar.backgroundColorByHexString("#1c1c1c");
    }
    if (window.Connection) {
      if (navigator.connection.type == Connection.NONE) {
        $rootScope.noConnection = true;
      }
      document.addEventListener("offline", function () {
        $rootScope.noConnection = true;
      }, false);
      document.addEventListener("online", function () {
        UserService.restoreAuth().then(function (authData) {
          $rootScope.noConnection = false;

          if (UserService.isAuthorized()) {
            UnreadNotificationsService.init();
            UserService.restoreLastScreen();
          }
          else {
            $rootScope.debugInfo({"m":'signup - online isAuthorized error', "d": UserService.getAuthData()});
            $state.go('signup');
          }
        },
        function (error) {
          $rootScope.noConnection = false;
          console.log('error on restore auth 1: ', error);
        });
      }, false);
    }

    $ionicLoading.show({
      template: '<p> Loading </p> <i class="icon ion-loading-c" style="color:#ffffff;" ></i>'
    });
    UserService.restoreAuth().then(function (authData) {
      if (!UserService.isAuthorized()) {
        console.log("Not authorized");
        //$cordovaSplashscreen.hide();
        $ionicLoading.hide();
        $rootScope.debugInfo({"m":'signup - natural', "d": UserService.getAuthData()});
      }
      else if (UserService.isAuthorized()) {
        UserService.loginUser().then(function (response) {
          if (response.status == "success") {
            $ionicLoading.hide();

            UserService.setAuthData({
              id: response.user._id,
              country: response.user.country,
              token: response.token,
              isAuth: true,
              type: 'mobile',
              pic: response.user.pic
            });

            $rootScope.unreadMessages = response.user.unread_messages;
            $rootScope.unreadGroupsNotifications = response.user.unread_group_notifications;
            UnreadNotificationsService.init();



            NotificationService.initPushwoosh().then(function (pushToken) {
              SettingsService.updateDevice({"pushwooshtoken": pushToken}).then(function () {
                NotificationService.setBadge($rootScope.unreadMessages + $rootScope.unreadGroupsNotifications);
                // registration done
              });
            }, function (error) {
              $rootScope.debugInfo(error);

                window.plugins.toast.showShortCenter('Can\'t register for push notifications', function (a) {
                }, function (b) {
                  console.log('toast error: ' + b)
                });

            });

            UserService.restoreLastScreen();
          } else {
            $rootScope.debugInfo({'m': 'signup - error on user login', 'd': response});
            if(response.code == 401) {
              $timeout(function () {
                $state.go('signup_step1');

                $timeout(function () {
                  $ionicLoading.hide();
                }, 50);
              }, ConfigService.signupPageTimeout);
            } else {
              $timeout(function () {
                $state.go('app.server_connection_error');

                $timeout(function () {
                  $ionicLoading.hide();
                }, 50);
              }, ConfigService.signupPageTimeout);
            }
          }
        }, function(status) {
          if(status == 0){
            $timeout(function () {
              $state.go('app.main.no_connection');

              $timeout(function () {
                $ionicLoading.hide();
              }, 50);
            }, ConfigService.signupPageTimeout);
          } else {
            $timeout(function () {
              $state.go('app.server_connection_error');

              $timeout(function () {
                $ionicLoading.hide();
              }, 50);
            }, ConfigService.signupPageTimeout);
          }
        });
      }
      },
    function (error) {
      console.log('error on restore auth 2: ', error);
      $rootScope.debugInfo({'m': 'restore auth 1', 'd': error});

      $timeout(function () {
        $state.go('signup_step1');

        $timeout(function () {
          $ionicLoading.hide();
        }, 50);
      }, ConfigService.signupPageTimeout);
    });
  });
});
