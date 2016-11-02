
app.factory('onboardingShareFactory', function($rootScope, $timeout, $q, $http, facebook, twitterFactory, instagramFactory, visitorFactory) {
  var onboardingShareFactory = {};

  onboardingShareFactory.handleShare = function(shareMessage, shareWithFacebook, shareWithTwitter, shareWithInstagram) {
    var sharePromises = [];

    if (shareWithFacebook) {
      sharePromises.push(handleFacebookShare(shareMessage));
      visitorFactory.handleAction("future_shareFB");
    }

    if (shareWithTwitter) {
      sharePromises.push(handleTwitterShare(shareMessage));
      visitorFactory.handleAction("future_shareTWTR");
    }

    if (shareWithInstagram) {
      //sharePromises.push(handleInstagramShare(shareMessage));
      visitorFactory.handleAction("future_shareIG");
    }

    return $q.all(sharePromises);
  }

  var handleFacebookShare = function(shareMessage) {
    var handleFacebookSharePromise = $q.defer();

    if (ionic.Platform.isAndroid()) {
      facebook.api('/me/feed?method=post&message=' + encodeURIComponent(shareMessage), 
                ['publish_actions'],
                'POST').then(function(response) {
      console.log(response);
      visitorFactory.handleAction("future_shareFB_success");
      handleFacebookSharePromise.resolve(response);
      }, function(error) { 
        console.log(error);
        visitorFactory.handleAction("future_shareFB_error"); 
      });
    } else {
      facebook.api('/me/feed?message=' + encodeURIComponent(shareMessage), 
                ['publish_actions'],
                'POST').then(function(response) {
      console.log(response);
      handleFacebookSharePromise.resolve(response);
      visitorFactory.handleAction("future_shareFB_success");
      }, function(error) { 
        console.log(error); 
        visitorFactory.handleAction("future_shareFB_error"); 
      });
    }

    return handleFacebookShare.promise;
  }

  var handleTwitterShare = function(shareMessage) {
    $timeout(function() {
      twitterFactory.initTwitterClient();
    }, 1000);

    var handleTwitterShare = $q.defer();

    var unregister = $rootScope.$on('twitterInitialized', function(event, twitterClient) {
      twitterClient.post({
        url: '1.1/statuses/update.json',
        data: {
          status: shareMessage
        }
      }).
      done(function(response) {
        console.log(response);
        handleTwitterShare.resolve(response);
        unregister();
      }).
      fail(function(error) {
        console.log(error);
        handleTwitterShare.reject(error);
      });
    });

    return handleTwitterShare.promise;
  }

  var handleInstagramShare = function(shareMessage) {
    var handleInstagramShare = $q.defer();

    instagramFactory.getInstagramClient();

    return handleInstagramShare.promise;
  }

  return onboardingShareFactory;
});