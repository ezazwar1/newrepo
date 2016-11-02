
app.factory('shareFactory', function($rootScope, $timeout, $cordovaDialogs, $ionicLoading, $q, $http, authenticationFactory, visitorFactory, facebook, twitterFactory, instagramFactory, canvasService, configuration) {
  var shareFactory = {};

  shareFactory.handleShare = function(shareMessage, shareWithFacebook, shareWithTwitter, shareWithInstagram) {
    var handleSharePromise = $q.defer();

    var share_message = shareMessage;
    var share_with_facebook = shareWithFacebook;
    var share_with_twitter = shareWithTwitter;
    var share_with_instagram = shareWithInstagram;

    var share_activity = this.share_activity;
    var share_object;

    share_activity.fetchParseActivity(share_activity.parseActivityID, 
                                      share_activity.createdTime,
                                      share_activity.activityType,
                                      share_activity.message).then(function(activity) {

      return createShare(activity);
    }).then(function(share) {
      // var share_link = configuration.baseURL + '#!/post/' + share.id;

      // if (share_message.indexOf(configuration.baseURL) == -1) {
      //   share_message = share_message + ' ' + share_link;
      // } else {
      //   share_message = share_message.replace(configuration.baseURL, share_link);
      // }

      share_object = share;
      return createShareCanvasDataURL(share_activity);
    }, function(error) {
      console.log(error);
      handleSharePromise.reject(error);
    }).then(function(image_data_url) {
      if (!image_data_url) {
        visitorFactory.handleAction("feed_share_no_image_data_url");
        handleSharePromise.reject('An error occurred while trying to share!');
        return;
      }
      visitorFactory.handleAction("feed_share_created_image_data");

      var handleSharePromises = [];
      
      if (share_with_facebook) {
        handleSharePromises.push(handleFacebookShare(share_object, share_message, image_data_url));
      }

      if (share_with_twitter) {
        //handleSharePromises.push(handleTwitterShare(share_object, share_message, image_data_url));
      }

      if (share_with_instagram) {
        //handleSharePromises.push(handleInstagramShare(share_object, share_message, image_data_url));
      }

      return $q.all(handleSharePromises);
    }, function(error) {
      handleSharePromise.reject(error);
    }).then(function(promises) {
      handleSharePromise.resolve(promises);
    }, function(error) {
      handleSharePromise.reject(error);
    });

    return handleSharePromise.promise;
  }

  var handleFacebookShare = function(share, share_message, image_data_url) {
    var handleFacebookSharePromise = $q.defer();

    var facebook_session_token;

    handleFacebookPublishActionsPermission().then(function(fb_session_token) {
      $ionicLoading.show({
        content: 'Sharing... &nbsp;<i class="icon ion-loading-c"></i>',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
      });

      facebook_session_token = fb_session_token;

      var file = new Parse.File("canvas.jpg", {"base64": image_data_url});
      share.set('canvas', file);
      return share.save();
    }).then(function(share_object_with_canvas) {
      var request_url = 'https://graph.facebook.com/me/photos?access_token=' 
                                                          + facebook_session_token
                                                          + '&url='
                                                          + share_object_with_canvas.get('canvas').url();

      $http.post(request_url, {
          transformRequest: angular.identity,
          headers: {'Content-Type': undefined}
      }).
      success(function(response) {
        handleFacebookSharePromise.resolve(response);
        console.log(response);

        share_object_with_canvas.set('sharedSuccessfully', true);
        share_object_with_canvas.set('fbPostID', response['id']);
        share_object_with_canvas.save();
      }).
      error(function(error) {
        handleFacebookSharePromise.reject(error);
      });

    }).catch(function(error) {
      handleFacebookSharePromise.reject(error);
    });

    return handleFacebookSharePromise.promise;
  }

  var handleFacebookPublishActionsPermission = function() {
    var handleFacebookPublishActionsPermissionPromise = $q.defer();

    authenticationFactory.getFacebookPermissions().then(function(permissions) {
      if (permissions['publish_actions']) {
        visitorFactory.handleAction("feed_share_found_publish_actions").then(function(action) {
          return authenticationFactory.getFacebookSessionToken();
        }).then(function(facebook_session_token) {
          handleFacebookPublishActionsPermissionPromise.resolve(facebook_session_token);  
        },
        function(error) {
          handleFacebookPublishActionsPermissionPromise.reject(error);
        });
      } else {
        visitorFactory.handleAction("feed_share_need_publish_actions").then(function(action) {
          return authenticationFactory.handleAddFacebookPermissions('publish_actions');
        }).then(function(fb_session_token) {
          handleFacebookPublishActionsPermissionPromise.resolve(fb_session_token);
        },
        function(error) {
          handleFacebookPublishActionsPermissionPromise.reject(error);
        });
      }
    },
    function(error) {
      handleFacebookPublishActionsPermissionPromise.reject(error);
    });

    return handleFacebookPublishActionsPermissionPromise.promise;
  }


  var handleTwitterShare = function(share, share_message, image_data_url) {
    var handleTwitterSharePromise = $q.defer();

    var fd = new FormData();
    fd.append('status', share_message);
    fd.append('media[]', dataURItoBlob(imageDataURL));

    $timeout(function() {
      twitterFactory.initTwitterClient();
    }, 1000);

    var unregister = $rootScope.$on('twitterInitialized', function(event, twitterClient) {
      twitterClient.post({
        url: '1.1/statuses/update_with_media.json',
        data: fd,
        mimeType:'multipart/form-data',
        contentType: false,
        cache: false,
        processData:false,          
      }).done(function(response) {
        console.log(response);
        if(response.error) {
          shareTwitterPromise.reject(response.error);
        } else {
          shareTwitterPromise.resolve(response);
          unregister();
        }
      });
    });

    return handleTwitterSharePromise.promise;
  }
  
  var handleInstagramShare = function(share, share_message, image_data_url) {
    var handleShareInstagramPromise = $q.defer();

    Instagram.isInstalled(function (err, installed) {
      if (installed) {
        Instagram.share(imageDataURL, share_message, function(err) {
          if (err) {
            shareInstagramPromise.reject(err);
          } else {
            shareInstagramPromise.resolve(true);
          }
        });
      } else {
        console.log('Instagram is not installed');
        $cordovaDialogs.alert('Instagram is not installed! :(');
      }
    });

    return handleShareInstagramPromise.promise;
  }

  var createShareCanvasDataURL = function(share_activity) {
    var createShareCanvasDataURLPromise = $q.defer();

    if (share_activity) {
      if (!share_activity.mediaURL) {
        canvasService.init(share_activity.message, 
                           share_activity.getPrettyYearsAgo(),
                           share_activity.getPrettyDate(),
                           share_activity.forUserProfilePictureURL,
                           share_activity.forUserName);
        canvasService.exec().then(function(dataURL) {
          createShareCanvasDataURLPromise.resolve(dataURL);
        });
      } else {
        canvasService.initWithMediaAndCaption(share_activity.getPrettyYearsAgo(),
                                              share_activity.getPrettyDate(),
                                              share_activity.mediaURL,
                                              share_activity.message,
                                              share_activity.forUserProfilePictureURL,
                                              share_activity.forUserName);

        if (share_activity.activityType == 1 || share_activity.activityType == 2) {
          // Use proxy if twitter or instagram
          canvasService.execWithImage(true).then(function(dataURL) {
            createShareCanvasDataURLPromise.resolve(dataURL);
          });
        } else {
          canvasService.execWithImage(false).then(function(dataURL) {
            createShareCanvasDataURLPromise.resolve(dataURL);
          });
        }
      }
    } else {
      createShareCanvasDataURLPromise.reject('share_activity not found!');
    }

    return createShareCanvasDataURLPromise.promise;
  }

  var createShare = function(activity) {
    var createSharePromise = $q.defer();
    var Share = Parse.Object.extend('Share');

    var share_object = new Share();

    var currentUser = new Parse.User();
    currentUser.id = $rootScope.sessionUser.id;
    
    share_object.set('byUser', currentUser);
    share_object.set('sharedSuccessfully', false);
    share_object.set('shareType', 0);
    share_object.set('numVisits', 0);
    share_object.set('onMobile', true);
    share_object.set('forActivity', activity);

    createSharePromise.resolve(share_object);

    return createSharePromise.promise;
  }

  var dataURItoBlob = function(dataURI) {
      // convert base64 to raw binary data held in a string
      // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
      var byteString = atob(dataURI.split(',')[1]);

      // separate out the mime component
      var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

      // write the bytes of the string to an ArrayBuffer
      var ab = new ArrayBuffer(byteString.length);
      var ia = new Uint8Array(ab);
      for (var i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
      }

      try {
          return new Blob([ia.buffer], { type: 'image/png' });
      } catch(e) {

          window.BlobBuilder = window.BlobBuilder || 
                               window.WebKitBlobBuilder || 
                               window.MozBlobBuilder || 
                               window.MSBlobBuilder;
          var bb = new BlobBuilder();
          bb.append(ia.buffer);
          return bb.getBlob('image/png');
      }
  }

  return shareFactory;
}); 
