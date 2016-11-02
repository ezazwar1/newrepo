'use strict';
MyApp.controller('AppCtrl', function ($scope, $state, $ionicModal, $timeout, $ionicPopup, $location, $ionicViewService, $cordovaStatusbar, $stateParams, UserService) {

  if (window.StatusBar) {
    StatusBar.overlaysWebView(true);
  }

  $scope.prevPage = $stateParams.prevPage || 'Chats';

  if ($scope.isAndroid && !$cordovaStatusbar.isVisible())
    $cordovaStatusbar.show();

  $scope.go = function (path) {
    $location.path(path);
  };

  $scope.replaceLocation = function (newUrl) {
    window.location.replace(newUrl);
  };

  $scope.openPrevious = function (newUrl) {
    var prevPage = $stateParams.prevPage,
      path;

    if (prevPage && prevPage === 'Groups') {
      path = 'app/main/home';
    } else {
      path = 'app/chats';
    }

    $location.path(path);
  };

  $scope.backHistory = function () {
    window.history.back()
  };

  // Form data for the login modal
  $scope.loginData = {};
  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function (modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function () {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function () {
    $scope.modal.show();
  };

  $scope.logout = function ($event) {
    $event.preventDefault();
  }

  // Perform the login action when the user submits the login form
  $scope.doLogin = function () {
    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function () {
      $scope.closeLogin();
    }, 1000);
  };

  if ($location.path().indexOf("about") >= 0)
    $scope.hide_bar = true;
})

  .controller('AboutCtrl', function ($scope, $location, $cordovaStatusbar) {
    $scope.isAndroid = ionic.Platform.isAndroid();
    $scope.hide_bar = true;

    if ($scope.isAndroid)
      $cordovaStatusbar.hide();

    $scope.closePage = function () {
      if ($scope.isAndroid)
        $cordovaStatusbar.show();

      $location.path('app/settings');
    }
  })

  .controller('NewsFeedCtrl', function ($scope, $ionicModal, $timeout, $ionicPopup, $location) {

    $scope.feeds = [
      {
        "likes": 50,
        "hearth": 50,
        "dislikes": 0,
        "messages": true,
        "chatMessages": 0
      },
      {
        "likes": 0,
        "hearth": 0,
        "dislikes": 1,
        "messages": false,
        "chatMessages": 100
      },
    ];

    $scope.getHandUp = function (index) {
      if ($scope.feeds[index].likes > 0)
        return "img/hand-up.png";
      else
        return "img/hand-up-grey.png";
    }
    $scope.getHearth = function (index) {
      if ($scope.feeds[index].hearth > 0)
        return "img/heart.png";
      else
        return "img/heart-grey.png";
    }
    $scope.getHandDown = function (index) {
      if ($scope.feeds[index].dislikes > 0)
        return "img/hand-down.png";
      else
        return "img/hand-down-grey.png";
    }
    $scope.addLike = function (index) {
      $scope.feeds[index].likes += 1;
    }
    $scope.addHearth = function (index) {
      $scope.feeds[index].hearth += 1;
    }
    $scope.addDislike = function (index) {
      $scope.feeds[index].dislikes += 1;
    }
  })

  .controller('AccountCtrl', function ($scope, $ionicModal, $timeout, $ionicPopup, $location, $ionicViewService, $state, NotificationService) {

    $scope.notifications;

    $scope.replaceLocation = function (newUrl) {
      window.location.replace(newUrl);
    };

    $scope.backHistory = function () {
      window.history.back()
    };

    $scope.getNotifications = function () {

      NotificationService.getNotificationSettings().then(function (response) {

        if (response.status === "success") {
          $scope.notifications = {
            is_likes: response.notification.is_likes,
            is_new_comments: response.notification.is_new_comments,
            is_new_posts: response.notification.is_new_posts,
            is_new_messages: response.notification.is_new_messages
          };
          $scope.notifications.is_all = (response.notification.is_likes
            || response.notification.is_new_comments
            || response.notification.is_new_posts
            || response.notification.is_new_messages
          );
        }
        if ($scope.notifications === undefined) {
          $scope.notifications = {
            is_all: true,
            is_likes: true,
            is_new_comments: true,
            is_new_posts: true,
            is_new_messages: true
          };
        }
      });
    };

    $scope.getNotifications();

    $scope.delete_account = function () {
      var confirmPopup = $ionicPopup.confirm({
        title: 'Delete account',
        template: 'Are you sure you want to delete your account?'
      });
      confirmPopup.then(function (res) {
        if (res)
          navigator.app.exitApp();
      });
    };

    $scope.switchAll = function () {
      $scope.notifications.is_likes = !$scope.notifications.is_likes;
      $scope.updateNotifications();
    };

    var _updateIsAll = function () {
      if ($scope.notifications.is_likes
        || $scope.notifications.is_new_comments
        || $scope.notifications.is_new_posts || $scope.notifications.is_new_messages
      ) {
        $scope.notifications.is_all = true;
      }
    };

    $scope.switchLikes = function () {
      $scope.notifications.is_likes = !$scope.notifications.is_likes;
      $scope.updateNotifications();
    };

    $scope.switchComments = function () {
      $scope.notifications.is_new_comments = !$scope.notifications.is_new_comments;
      $scope.updateNotifications();
    };

    $scope.switchPosts = function () {
      $scope.notifications.is_new_posts = !$scope.notifications.is_new_posts;
      $scope.updateNotifications();
    };

    $scope.switchChatMessages = function () {
      $scope.notifications.is_new_messages = !$scope.notifications.is_new_messages;
      $scope.updateNotifications();
    };

    $scope.updateNotifications = function () {

      var notificationData = {
        is_likes: $scope.notifications.is_likes,
        is_new_comments: $scope.notifications.is_new_comments,
        is_new_posts: $scope.notifications.is_new_posts,
        is_new_messages: $scope.notifications.is_new_messages
      };

      NotificationService.updateNotificationSettings(notificationData).then(function (response) {
        if (response.status === "success") {
          console.log("Notification settings updated");
        } else {
          console.log("Notification settings could not be updated");
        }
      });
    };
  })

  .directive('numberOnlyInput', function () {
    return {
      restrict: 'EA',
      template: '<input name="{{inputName}}" ng-model="inputValue" placeholder="{{placeholder}}" />',
      scope: {
        inputValue: '=',
        inputName: '=',
        placeholder: "="
      },
      link: function (scope) {
        scope.$watch('inputValue', function (newValue, oldValue) {
          var arr = String(newValue).split("");
          if (!newValue)
            return;
          if (arr.length === 0)
            return;
          if (arr.length === 1 && newValue === '+')
            return;
          if (isNaN(newValue)) {
            scope.inputValue = oldValue;
          }
        });
      }
    };
  })
  .directive('blurOnScroll', function () {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        element[0].addEventListener('scroll', onContentScroll);

        function onContentScroll() {
          if (cordova.plugins && cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.close();
          }
        }

        //var input = document.getElementsByClassName('users-search')[0];
        //
        //function onContentScroll() {
        //  if (input && input.onblur) {
        //    input.onblur();
        //  }
        //}
      }
    };
  })

  //.directive('focusMe', [ '$timeout', function($timeout) {
  //    return {
  //        link: function(scope, element, attrs) {
  //            $timeout(function() {
  //                element[0].focus();
  //                cordova.plugins.Keyboard.show();
  //            }, 150);
  //        }
  //    };
  //}])
  .directive('imageSize', function () {
    return {
      link: function (scope, element, attrs) {
        element.on('load', function () {
          var height = element[0].offsetWidth;
          element.css({
            height: height + 'px'
          });
        });
      }
    };
  })
  .directive('sendBtn', function ($timeout) {
    return {
      link: function (scope, element, attrs) {
        $timeout(function () {
          if(scope[attrs.action] && typeof scope[attrs.action] === 'function') {
            scope[attrs.action]();
          } else {
            scope.$apply(attrs.action);
          }

        }, 700)

      }
    };
  })
  .directive('pushAvatar', function () {
    return {
      link: function (scope, element, attrs) {
        element.on('load', function () {
          var height = element[0].offsetWidth;
          element.css({
            'height': height + 'px',
            'min-height': '40px'
          });
        });
      }
    };
  })
  .directive('constantFocus', function ($rootScope) {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        element[0].addEventListener('focusout', function (e) {
          //if (scope.isInCommentingMode) {
          if ($rootScope.isInCommentingMode) {
            element[0].focus();
          }
        });
      }
    };
  })
  .directive('noAnimate', ['$animate',
    function ($animate) {
      return {
        restrict: 'A',
        link: function (scope, element, attrs) {
          $animate.enabled(false, element)
          scope.$watch(function () {
            $animate.enabled(false, element)
          })
        }
      };
    }
  ])
  .directive('imageLoaded', ['$ionicScrollDelegate', function ($ionicScrollDelegate) {
    return {
      link: function (scope, element, attr) {
        if (attr.justPostedImage) {
          element.on('load', function () {
            $ionicScrollDelegate.scrollBottom();
          })
        }
      }
    }
  }])

  .directive('parseHtmlOnce', ['$parse', '$sce', function ($parse, $sce) {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        var ngBindHtmlGetter = $parse(attrs.parseHtmlOnce);
        element.html($sce.getTrustedHtml(ngBindHtmlGetter(scope)) || '');
      }
    };
  }])

  .directive('datePosition', ['$timeout', function ($timeout) {
    return {
      link: function (scope, element, attr) {
        $timeout(function () {
          var selector = '#' + attr.id + ' .feed-text-name',
            contentBlock = angular.element(document.querySelector(selector)),
            height = contentBlock[0].offsetHeight;

          element.css({
            'padding-top': (height / 5).toFixed() + 'px'
          })
        });
      }
    }
  }])

  .directive('customMaxlength', function() {
    return {
      require: 'ngModel',
      link: function (scope, element, attrs, ngModelCtrl) {
        var maxlength = Number(attrs.customMaxlength);
        function fromUser(text) {
          if (text.length > maxlength) {
            var transformedInput = text.substring(0, maxlength);
            ngModelCtrl.$setViewValue(transformedInput);
            ngModelCtrl.$render();
            return transformedInput;
          }
          return text;
        }
        ngModelCtrl.$parsers.push(fromUser);
      }
    };
  })
