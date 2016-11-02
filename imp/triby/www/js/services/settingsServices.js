'use strict';

MyApp.factory('SettingsService', [
  '$q',
  '$rootScope',
  '$http',
  '$timeout',
  '$cordovaCamera',
  '$cordovaFile',
  '$cordovaContacts',
  '$cordovaDevice',
  '$ionicLoading',
  '$ionicPlatform',
  '$jrCrop',
  '$ionicModal',
  'ConfigService',
  'UserService',
  'LoadingService',
  '_',
  function($q,
           $rootScope,
           $http,
           $timeout,
           $cordovaCamera,
           $cordovaFile,
           $cordovaContacts,
           $cordovaDevice,
           $ionicLoading,
           $ionicPlatform,
           $jrCrop,
           $ionicModal,
           ConfigService,
           UserService,
           LoadingService,
           _)
  {

  var settingsServiceFactory = {};

  var saveThumbProgress = 5;
  var compressVideoProgressValue = 8;
  var prepareServerVideoInfoProgress = 10;

  var isIos = ionic.Platform.isIOS();
  var compressedVideoDimension = '320:240';
  var trimmedVideoDuration = 15;

  var tempStorageDirectory = '';

$ionicPlatform.ready(function() {
  if(!isIos) {
    if(cordova.file) {
      window.FilePath.resolveNativePath(cordova.file.cacheDirectory || cordova.file.dataDirectory || cordova.file.applicationStorageDirectory,
        function(path){
          console.log('s', arguments);
          tempStorageDirectory = path;
        },
        function(){
          console.log('err resolveNativePath: ', arguments);
          tempStorageDirectory = 'Android/data/com.sygnium.TribyApp/';
        });
    } else {
      console.error('cordova.file is undefined!');
      tempStorageDirectory = 'Android/data/com.sygnium.TribyApp/';
    }

  }

})



  var _changeNumbers = function(numbers) {
    var deferred = $q.defer();
    var authData = UserService.getAuthData();
    var data = {
      old_number:numbers.old_number,
      new_number:numbers.new_number
    };

    $http.defaults.headers.common['Authorization'] = authData.token;
    $http.post($rootScope.urlBackend + '/user/changenumber', data).success(function (response) {

      if(response.status == "success")
        //localStorageService.set('authorizationData', { username: response.user.username, mobilenumber: response.user.mobilenumber, token:authData.token, isAuth:true });

      deferred.resolve(response);
    }).error(function (err, status) {
      deferred.reject(err);
    });

    return deferred.promise;

  };

  var _removeUser = function(numbers){

    var deferred = $q.defer();
    var authData = UserService.getAuthData();
    var data = {
                    old_number:numbers.old_number,
                    new_number:numbers.new_number
                };

    $http.defaults.headers.common['Authorization'] = authData.token;
    $http.post($rootScope.urlBackend + '/user/delete', data).success(function (response) {

      if(response.status == "success")
        //localStorageService.remove('authorizationData');

      deferred.resolve(response);
    }).error(function (err, status) {
      deferred.reject(err);
    });

    return deferred.promise;

  };

  var _prepareServerInformation = function(fileName) {
    var deferred = $q.defer(),
        contentType = 'image/jpeg';

    $http.get($rootScope.urlBackend + '/s3_signature?file_name=' + fileName + '&content_type=' + contentType)
      .success(function(response) {
        var s3Url = $rootScope.s3Url.replace('{0}', response.bucket);
        var uploadOptions = new FileUploadOptions();

        uploadOptions.fileKey = 'file';
        uploadOptions.fileName = fileName;
        uploadOptions.mimeType = contentType;
        uploadOptions.chunkedMode = false;
        uploadOptions.params = {
          "key": fileName,
          "AWSAccessKeyId": response.awsKey,
          "acl": "public-read",
          "policy": response.policy,
          "signature": response.signature,
          "Content-Type": contentType
        };

        deferred.resolve({
          s3Url: s3Url,
          uploadOptions: uploadOptions
        });
      })
      .error(function(err, status){
        console.log(status + ': ' + err);
        deferred.reject(err);
      });

      return deferred.promise;
  };

  var _prepareServerVideoInformation = function(fileName) {
    var deferred = $q.defer(),
        contentType = 'video/mp4';

    if(fileName.endsWith('.3gp')) {
      contentType = 'video/3gpp';
    }

    $http.get($rootScope.urlBackend + '/s3_signature?file_name=' + fileName + '&content_type=' + contentType)
      .success(function(response) {
        var s3Url = $rootScope.s3Url.replace('{0}', response.bucket);
        var uploadOptions = new FileUploadOptions();

        uploadOptions.fileKey = 'file';
        uploadOptions.fileName = fileName;
        uploadOptions.mimeType = contentType;
        uploadOptions.chunkedMode = false;
        uploadOptions.params = {
          "key": fileName,
          "AWSAccessKeyId": response.awsKey,
          "acl": "public-read",
          "policy": response.policy,
          "signature": response.signature,
          "Content-Type": contentType
        };

        deferred.resolve({
          s3Url: s3Url,
          uploadOptions: uploadOptions
        });
      })
      .error(function(err, status){
        console.log(status + ': ' + err);
        deferred.reject(err);
      });

      return deferred.promise;
  };

  var _s3Upload = function(s3Url, fileURL, fileName, uploadOptions, options) {
    var deferred = options && options.promise || $q.defer();
    var newOptions;

    if(options && options.moveProgress) {
      $cordovaFile.uploadFile(s3Url, fileURL, uploadOptions)
        .then(successCb, errorCb, progressCb);
    } else {
      $cordovaFile.uploadFile(s3Url, fileURL, uploadOptions)
        .then(successCb).catch(errorCb);
    }

    function successCb(data) {
      data.url_file = s3Url + fileName;
      data.status = 'success';
      deferred.resolve(data);
    }

    function errorCb(error) {
      console.log('error with s3 upload');
      console.log(error);

      //do retry twice if file transfer return error(sometimes something wrong with aws)
      if(error && !options || error && !options.retryCalledTwice) {
        newOptions = options || {};
        newOptions.promise = deferred;

        if(newOptions.retryCalledOnce && !newOptions.retryCalledTwice) {
          newOptions.retryCalledTwice = true;
        } else {
          newOptions.retryCalledOnce = true;
        }

        _s3Upload(s3Url, fileURL, fileName, uploadOptions, newOptions);
      } else {
        deferred.reject(error);
      }
    }

    function progressCb(progressEvent) {
      if (progressEvent && progressEvent.lengthComputable) {
        var currentVideoProgress = (progressEvent.loaded / progressEvent.total) * 100;

        if(currentVideoProgress > prepareServerVideoInfoProgress) {
          LoadingService.setPercentage(currentVideoProgress);
        }

      } else {
        LoadingService.increment();
      }
    }

    return deferred.promise;
  };

  function _cropImage(url) {
    var deferred = $q.defer();

    $jrCrop.crop({
      url: url,
      width: ConfigService.cropWidth,
      height: ConfigService.cropHeight
    }).then(function(canvas) {
      var image = canvas.toDataURL().replace(/data:image\/png;base64,/,'');
      deferred.resolve(image);
    }).catch(function(err) {
      deferred.reject(err);
    });

    return deferred.promise;
  }

  function _getImageOptions(aType, aSource) {
    var options = {
      quality: 50
      , destinationType: Camera.DestinationType.DATA_URI   //, destinationType: Camera.DestinationType.FILE_URI ???
      , encodingType: Camera.EncodingType.JPEG
      , saveToPhotoAlbum: false
      , correctOrientation: true
    };

    if(aSource === 'CAMERA') {
      options.sourceType = Camera.PictureSourceType.CAMERA;
    }
    else {
      options.sourceType = Camera.PictureSourceType.PHOTOLIBRARY;
    }

    switch(aType) {
      case 'AVATAR':
        options.targetWidth = 400;
        options.targetHeight = 400;
        break;

      case 'TRIBY':
        options.targetWidth = 400;
        options.targetHeight = 400;
        break;
      case 'POST':
        options.targetWidth = 800;
        options.targetHeight = 800;
        break;
      default:
        options.targetWidth = 800;
        options.targetHeight = 600;
    }

    return options;
  }

  function _getVideoPickerOptions(aType, aSource) {
    var options = {
      destinationType: Camera.DestinationType.DATA_URL
      , saveToPhotoAlbum: true
      , correctOrientation: true
      , sourceType: Camera.PictureSourceType.PHOTOLIBRARY
      , mediaType : Camera.MediaType.VIDEO
      , quality: 100
    };

    return options;
  }

  function _getVideoRecordOptions(aType, aSource) {
    return {
      limit: 1,
      duration: 15,
      quality: 0
    };
  }

  var _fileTo = function(params) {
    var serverURL = params.serverURL,
      aType = params.aType,
      aSource = params.aSource,
      consumerScope = params.consumerScope,
      filename = params.filename,
      def = params.def;

    var deferred = def || $q.defer(),
        options;

    if (ionic.Platform.isWebView()) {
      if(cordova.plugins && cordova.plugins.Keyboard) cordova.plugins.Keyboard.close();
      options = _getImageOptions(aType, aSource);

      $cordovaCamera.getPicture(options).then(function(fileURL) {
        if(cordova.plugins && cordova.plugins.Keyboard) cordova.plugins.Keyboard.close();
        var uploadOptions = {
          deferred: deferred,
          filename: filename,
          fileURL: fileURL
        };

        if(consumerScope && aSource === 'LIBRARY') {
          //show modal window with option to cancel uploading the file
          consumerScope.urls = $rootScope.urls || {};
          consumerScope.urls.imgForUploadingUrl = fileURL;
          showReviewImageModal(consumerScope, function(rejected, confirmed) {
            if(cordova.plugins && cordova.plugins.Keyboard) cordova.plugins.Keyboard.close();

            if(rejected) {
              return _fileTo({
                serverURL: serverURL,
                aType: aType,
                aSource: aSource,
                consumerScope: consumerScope,
                filename: filename,
                def: deferred
              });
            }

            uploadFile(uploadOptions);
          });

        } else {
            $ionicLoading.hide();
            $ionicLoading.show({
              template: '<p>Uploading...</p> ' +
              '<tek-progress-bar ng-model="progressBar.val" ></tek-progress-bar>'
            });

          uploadFile(uploadOptions);
        }

      }).catch(function(err){
        $ionicLoading.hide();
        deferred.reject(err);
      });
    }
    else {
      $ionicLoading.hide();
      deferred.reject('Uploading not supported in browser');
    }

    return deferred.promise;
  };

  function getSafeUriName(str) {
    if(!str) return str;

    return str.replace(/\W+/g, "");
  }

  function uploadFile(options) {
    var deferred = options.deferred,
      filename = options.filename,
      fileURL = options.fileURL,
      fileName;

    if (_.isUndefined(filename)) {
      var authData = UserService.getAuthData();
      fileName = getSafeUriName(authData.username) + '_' + Date.now() + '.jpg';
    } else {
      fileName = getSafeUriName(filename) + '_' + Date.now() + '.jpg';
    }
    fileName = fileName.split(' ').join('_');
    /**
     * Get information for s3 upload
     */
    _prepareServerInformation(fileName).then(function(data) {
      LoadingService.setPercentage(4);
      /**
       * Upload file to s3.
       */
      _s3Upload(data.s3Url, fileURL, fileName, data.uploadOptions, {moveProgress: true}).then(function(data) {
        deferred.resolve(data);
      }).catch(function(err) {
        deferred.reject(err);
      });
    }).catch(function(err) {
      deferred.reject(err);
    })

  }

  function showReviewImageModal(scope, callback) {
    scope.cancelUploading = function() {
      scope.reviewImageModal.hide();
      scope.reviewImageModal.remove();
      scope.urls.imgForUploadingUrl = null;
      $ionicPlatform.offHardwareBackButton(removeModal);
      callback('cancelled by user');
    };

    scope.confirmUploading = function() {
      $ionicLoading.show({
        template: '<p>Uploading...</p> ' +
        '<tek-progress-bar ng-model="progressBar.val" ></tek-progress-bar>'
      });

      scope.reviewImageModal.hide();
      scope.reviewImageModal.remove();
      scope.urls.imgForUploadingUrl = null;
      $ionicPlatform.offHardwareBackButton(removeModal);
      callback(false, 'uploading confirmed');
    };


    $ionicModal.fromTemplateUrl('templates/review_image.html', function(modal) {
      $ionicLoading.hide();
      scope.reviewImageModal = modal;
      scope.reviewImageModal.show();
    }, {
      scope: scope,
      animation: 'none'
    });

    $ionicPlatform.onHardwareBackButton(removeModal);

    function removeModal(event) {
      $ionicPlatform.offHardwareBackButton(removeModal);

      scope.reviewImageModal.hide();
      scope.reviewImageModal.remove();
      scope.urls.imgForUploadingUrl = null;
      callback('cancelled by user');

      event.preventDefault();
      return false;
    }
  }

  var _videoTo = function (serverURL, aType, aSource, filename) {
    var deferred = $q.defer(),
      videoExtension = '.mp4',
      options;

    if (ionic.Platform.isWebView()) {
      //if (aSource === 'CAMERA') {
        options = _getVideoRecordOptions(aType, aSource);

        navigator.device.capture.captureVideo(
          function (videoData) {
            if(!videoData ||!videoData[0] || !videoData[0].fullPath) {
              deferred.reject("Can't capture the video!");
              return;
            }

            LoadingService.setPercentage(1);

            var fileURL = videoData[0].fullPath,
              fileName;

            if(fileURL.endsWith('.3gp')) {
              videoExtension = '.3gp';
            }

            if (_.isUndefined(filename)) {
              var authData = UserService.getAuthData();
              fileName = getSafeUriName(authData.username) + '_' + Date.now() + videoExtension;
            } else {
              fileName = getSafeUriName(filename) + '_' + Date.now() + videoExtension;
            }
            fileName = fileName.split(' ').join('_');

            //todo think about async parallel here
            getAndSaveThumbnail(fileURL, fileName)
              .then(function (response) {
                LoadingService.setPercentage(saveThumbProgress);

                //var compressedFileName = authData.username + '_' + Date.now() + 'cmp' + videoExtension;  //worked for ios
                var compressedFileName = authData.username.replace(/ /g, '') + '_' + Date.now() + 'cmp',
                  compressOptions;

                if (response.status == "success") {
                  compressOptions = {
                    inputFilePath: fileURL,
                    outputFileName: compressedFileName,
                    outputFilePath: tempStorageDirectory + compressedFileName + '.mp4',
                    justCaptured: true
                  };

                  compressVideo(compressOptions, function (compressedFilePath) {
                      LoadingService.setPercentage(compressVideoProgressValue);

                      _prepareServerVideoInformation(fileName).then(function (data) {
                        LoadingService.setPercentage(prepareServerVideoInfoProgress);

                        _s3Upload(data.s3Url, compressedFilePath, fileName, data.uploadOptions, {moveProgress: true}).then(function (data) {
                          deferred.resolve({video: data, thumb: response});

                          removeFile(fileURL);
                        }).catch(function (err) {
                          deferred.reject(err);

                          removeFile(fileURL);
                        });
                      }).catch(function (err) {
                        deferred.reject(err);

                        removeFile(fileURL);
                      });
                    },
                    function (err) {
                      console.error('----------- transcode video error: ', err);
                      deferred.reject(err);

                      removeFile(fileURL);
                    });

                } else {
                  deferred.reject('can\'t upload thumbnail to the server');
                }
              }, function (err) {
                console.error('err during capture video: ', err);
                deferred.reject(err);

                removeFile(fileURL);
                // An error occurred. Show a message to the user
              });
          },
          function (err, res) {
            console.log('err capture video: ', err);
            console.log('res: ', res);
//            alert('close')
            deferred.reject(err);
          },
          options
        );

    /*
      } else {
        //options = _getVideoPickerOptions(aType, aSource);
        //
        //$cordovaCamera.getPicture(options).then(function (fileURL) {
        //  if(!fileURL) {
        //    deferred.reject("Error during getting the file!");
        //    return;
        //  }
        //
        //  var fileName, compressedFileName;
        //  if (_.isUndefined(filename)) {
        //    var authData = UserService.getAuthData();
        //    fileName = getSafeUriName(authData.username) + '_' + Date.now() + videoExtension;
        //    compressedFileName = getSafeUriName(authData.username) + '_' + Date.now() + 'cmp' + videoExtension;
        //  } else {
        //    fileName = getSafeUriName(filename) + '_' + Date.now() + videoExtension;
        //    compressedFileName = filename + '_' + Date.now() + 'cmp' + videoExtension;
        //  }
        //  fileName = fileName.split(' ').join('_');
        //  compressedFileName = compressedFileName.split(' ').join('_');
        //  getAndSaveThumbnail(fileURL, fileName)
        //    .then(function (response) {
        //      if (response.status == "success") {
        //        _prepareServerVideoInformation(fileName).then(function (data) {
        //          var compressOptions = {
        //            inputFilePath: fileURL,
        //            outputFileName: compressedFileName
        //          };
        //
        //          compressVideo(compressOptions, function (compressedFilePath) {
        //              console.log('compressVideo args: ', JSON.stringify(arguments));
        //
        //              _s3Upload(data.s3Url, compressedFilePath, fileName, data.uploadOptions).then(function (data) {
        //                deferred.resolve({video: data, thumb: response});
        //
        //                removeFile(compressedFilePath);
        //              }).catch(function (err) {
        //                deferred.reject(err);
        //
        //                removeFile(compressedFilePath);
        //              });
        //            },
        //            function (err) {
        //              console.error('transcode video error: ', err);
        //
        //              _s3Upload(data.s3Url, fileURL, fileName, data.uploadOptions).then(function (data) {
        //                deferred.resolve({video: data, thumb: response});
        //              }).catch(function (err) {
        //                deferred.reject(err);
        //              });
        //            });
        //
        //        }).catch(function (err) {
        //          deferred.reject(err);
        //        })
        //      } else {
        //        deferred.reject('can\'t upload thumbnail to the server');
        //      }
        //
        //    })
        //    .catch(function (err) {
        //      deferred.reject(err);
        //    });
        //
        //}).catch(function (err) {
        //  deferred.reject(err);
        //});
      //}

   // */

    }
    else {
      deferred.reject('Uploading not supported in browser');
    }

    return deferred.promise;
  };

  function getAndSaveThumbnail(videoPathBase, videoFileName) {
    var deferred = $q.defer(),
      nameWithoutFileProtocol;

    console.log('videoPathBase: ',videoPathBase);

    if(isIos) {
      if(videoPathBase.substring(0, 8) === "file:///") {
        nameWithoutFileProtocol = videoPathBase.substring(8);
      } else {
        nameWithoutFileProtocol = videoPathBase;
      }

      createThumb(nameWithoutFileProtocol);
    } else {
      window.FilePath.resolveNativePath(videoPathBase, createThumb, function(err) {
        console.log('thumbnail resolveNativePath err: ', err);
        deferred.reject(err);
      });
    }


    function createThumb(result) {
      var videoPath = 'file://' + result;
      var thumbPath = videoPath.slice(0, -4) + '.jpg';

      if(window.PKVideoThumbnail && window.PKVideoThumbnail.createThumbnail) {
        window.PKVideoThumbnail.createThumbnail(videoPath, thumbPath,
          function(filePath) {
            console.log('thumb success: ', filePath, arguments);
            //saving thumb
            var imgFileName = videoFileName.slice(0, -4) + '.jpg';
            _prepareServerInformation(imgFileName).then(function(data) {
              _s3Upload(data.s3Url, filePath, imgFileName, data.uploadOptions).then(function(data) {
                deferred.resolve(data);

                removeFile(filePath);
              }).catch(function(err) {
                deferred.reject(err);

                removeFile(filePath);
              });
            }).catch(function(err) {
              deferred.reject(err);

              removeFile(filePath);
            });
          },
          function(err) {
            console.log('create thumbnail err:', err);
            deferred.reject(err);
          });
      } else {
        $timeout(function() {
          console.log('thumbnail plugin unavailable!');
          deferred.reject('thumbnail plugin unavailable!');
        }, 50)
      }
    }


    return deferred.promise;
  }

  function compressVideo(options, success, error) {
    if(isIos) {
       return VideoEditor.transcodeVideo(
         success,
         function(err) {
           console.error('err during transcoding video: ', err);

           error("Can't convert video");
         },
         {
           fileUri: options.inputFilePath,
           outputFileName: options.outputFileName,
           quality: VideoEditorOptions.Quality.HIGH_QUALITY,
           outputFileType: VideoEditorOptions.OutputFileType.MPEG4,
           optimizeForNetworkUse: VideoEditorOptions.OptimizeForNetworkUse.NO,
           duration: 15,
           saveToLibrary: false,
           deleteInputFile: false
         }
       )
     } else {
       //todo figure out with mp4 transcoding
       // mp4 transcoding is very slow on android devices, so we will not transcode it
       if(options.justCaptured && getFileTypeByName(options.inputFilePath) === 'mp4') {
         return success(options.inputFilePath);
       }

       getAbsFilePathByUri(options.inputFilePath, function (err, inputFileAbsPath) {
         var outputFileAbsPath, ffmpegCommand, callFfmpegOptions
         if(err) {
           return error(err);
         }

         outputFileAbsPath = getCompressedFileOutputPath(inputFileAbsPath, options.outputFileName);
         ffmpegCommand = getAndroidFfmpegCommand(false, inputFileAbsPath, outputFileAbsPath);

         callFfmpegOptions = {
           ffmpegCommand: ffmpegCommand,
           toRemoveInputFile: options.justCaptured,
           outputFilePath:  outputFileAbsPath,
           inputFilePath: inputFileAbsPath,
           command: ffmpegCommand
         };

         processVideoWithFfmpeg(callFfmpegOptions, success, error);
       });
     }

    }

  function processVideoWithFfmpeg(options, success, error) {
    if(VideoEditor && typeof VideoEditor.execFFMPEG === 'function') {
      console.log(options.command);

      VideoEditor.execFFMPEG(
        function ss() {
          success(options.outputFilePath);
        },
        function err() {
          console.log('err ffmpeg cb: ', arguments);
          error('Error during transcoding the video!');
        },
        {
          cmd: options.command
        }
      );
    } else {
      error("Can't process the video!");
    }
  }

  function getAndroidFfmpegCommand(isVideoJustCaptured, inputFilePath, outputFilePath) {
    //todo check fils pathes, they should not have 'file://' protocol
    var scaleParam = 'scale=' + compressedVideoDimension;

    if(isVideoJustCaptured) {
      if(getFileTypeByName(inputFilePath) === 'mp4') {
        return ['-y', '-i', inputFilePath, '-async', '1', '-strict', '-2', '-vf', scaleParam, '-c:a', outputFilePath];
      } else {
        return ['-y', '-ss', '00:00:00', '-i', inputFilePath, '-to', '00:00:' + trimmedVideoDuration, '-async', '1', '-c', 'copy', outputFilePath];
      }
    } else {
      if(getFileTypeByName(inputFilePath) === 'mp4') {

        //todo implement this - add trimming and transcoding
        return [ '-y', '-ss', '00:00:00', '-i', inputFilePath, '-to', '00:00:' + trimmedVideoDuration, '-async', '1', '-c', 'copy', outputFilePath];

        //return ['-y', '-i', inputFilePath, '-async', '1', '-strict', '-2', '-vf', scaleParam, '-c:a', 'copy', outputFilePath];

        //return ['-y', '-i', '/sdcard/DCIM/Camera/1v.mp4', '-async', '1', '-strict', '-2', '-vf', 'scale=320:240', '-c:a', 'copy', '/sdcard/DCIM/Camera/1mp__scaled_ca_copy7.mp4'];
      } else {
        return [ '-y', '-ss', '00:00:00', '-i', inputFilePath, '-to', '00:00:' + trimmedVideoDuration, '-async', '1', '-c', 'copy', outputFilePath];
      }
    }
  }

  function isFileEmpty(fileUri, cb) {
    window.resolveLocalFileSystemURI(fileUri, function(fileEntry) {
      fileEntry.file(function(fileObj) {
        console.log("file Size = " + fileObj.size);

        if(fileObj.size == 0) {
          cb(true);
        } else {
          cb(false);
        }
      });
    }, function(err) {
      console.log('err isFileEmpty: ', err);
      cb(true);
    });
  }

  function getAbsFilePathByUri(fileUri, cb) {
    if(isIos) {
      return cb(null, fileUri);
    }

    window.FilePath.resolveNativePath(fileUri, function(filePath) {
      return cb(null, filePath);
    });
  }

  function removeFile(filePath) {
    console.log('removing file... ', filePath);

    if(filePath.substring(0, 4) !== "file") {
      filePath = "file:///" + filePath
    }

    if(!isIos && cameraPlugin && cameraPlugin.removeFile && typeof cameraPlugin.removeFile === 'function') {
      cameraPlugin.removeFile(function(){console.log('remove s: ', arguments)}, function(){console.log('remove err: ', arguments)}, {fileUri: filePath});
    } else {
      resolveLocalFileSystemURL(filePath, function(entry) {
        console.log(entry);
        entry.remove();
      }, function(err) {
        console.log(err);
      });
    }

  }

  function getCompressedFileOutputPath(baseFileUrl, compressedFileName) {
    var splittedBaseFilePath = baseFileUrl.split('/');
    splittedBaseFilePath.pop(splittedBaseFilePath.length - 1);

    return splittedBaseFilePath.join('/') + '/' + compressedFileName;
  }

  function getFileTypeByName(fileName) {
    var splittedName = fileName.split('.');
    return splittedName[splittedName.length-1];
  }

  function _b64toBlob(b64Data, contentType, sliceSize) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;

    var byteCharacters = window.atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);

      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      var byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, {type: contentType});
    return blob;
  }

  var _uploadImage = function(fileURL, filename) {
    var deferred = $q.defer(),
        fileName;

    if (_.isUndefined(filename)) {
      var authData = UserService.getAuthData();
      fileName = getSafeUriName(authData.username) + '_' + Date.now() + '.jpg';
    } else {
      fileName = getSafeUriName(filename) + '_' + Date.now() + '.jpg';
    }

    fileName = fileName.split(' ').join('_');

    /**
     * Get information for s3 upload
     */
    _prepareServerInformation(fileName).then(function(data) {
      /**
       * Upload file to s3.
       */
      _s3Upload(data.s3Url, fileURL, fileName, data.uploadOptions).then(function(data) {
        deferred.resolve(data);
      }).catch(function(err) {
        deferred.reject(err);
      });
    }).catch(function(err) {
      deferred.reject(err);
    });

    return deferred.promise;
  };

  var _uploadCropImage = function(aType, aSource, filename, isFinishWithLoading) {
    var deferred = $q.defer(),
        options;

    if (_.isUndefined(isFinishWithLoading)) {
      isFinishWithLoading = false;
    }

    if (ionic.Platform.isWebView()) {

      options = _getImageOptions(aType, aSource);

      $cordovaCamera.getPicture(options).then(function(fileURL) {
        var fileName;
        if (_.isUndefined(filename)) {
          var authData = UserService.getAuthData();
          fileName = getSafeUriName(authData.username) + '_' + Date.now() + '.jpg';
        } else {
          fileName = getSafeUriName(filename) + '_' + Date.now() + '.jpg';
        }
        fileName = fileName.split(' ').join('_');

        $timeout(function() {
          $ionicLoading.hide();
        });

        async.parallel({
          serverInfo: function(callback) {
            /**
             * Get information for s3 upload
             */
            $ionicLoading.hide();
            _prepareServerInformation(fileName).then(function(data) {
              callback(null, data);
            }).catch(function(err) {
              callback(null, err);
            })
          },
          cropImage: function(callback) {
            $ionicLoading.hide();
            _cropImage(fileURL).then(function(image) {

              if (isFinishWithLoading) {
                $ionicLoading.show({
                  template: 'Wait please...'
                });
              }

              var output = {
                status: 1,
                image: image
              }
              callback(null, output);
            }).catch(function(err) {
              callback(null, {
                status: 0
              });
            });
          }
        }, function(err, data) {

          if (_.isEqual(data.cropImage.status, 0)) return;

          var imageData = _b64toBlob(data.cropImage.image),
              fileEntryObject,
              fail = function(err) {
                console.log(err);
              },

              gotFileWriter = function(writer) {
                writer.seek(0);
                writer.onwrite = function() {
                  /**
                   * Upload file to s3.
                   */
                  _s3Upload(data.serverInfo.s3Url, fileEntryObject.toURL(), fileName, data.serverInfo.uploadOptions).then(function(data) {
                    /**
                     * Remove file from local file system.
                     */
                    fileEntryObject.remove();

                    deferred.resolve(data);
                  }).catch(function(err) {
                    deferred.reject(err);
                  });
                }
                writer.write(imageData);
              },

              gotFileEntry = function(fileEntry) {
                fileEntryObject = fileEntry;
                fileEntry.createWriter(gotFileWriter, fail);
              }

          /**
           * Request file system
           */
          window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fs) {
            fs.root.getFile(fileName, {create: true, exclusive: false}, gotFileEntry, fail);
          }, function(err) {
            console.log('can`t retrieve file system');
          });
        })


      }).catch(function(err){
        deferred.reject(err);
      });
    }
    else {
      deferred.reject('Uploading not supported in browser');
    }

    return deferred.promise;
  };

  var _saveProfile = function(userData){
    var deferred = $q.defer();
    var authData = UserService.getAuthData();

    $http.defaults.headers.common.Authorization = authData.token;

    $http.put($rootScope.urlBackend + '/v2' + '/users/' + authData.mobilenumber, userData).success(function (response) {
      if(response && response.status === 'success') {
        UserService.setAuthData(response.user);
      }

      deferred.resolve(response);
    }).error(function (err, status) {
      deferred.reject(err);
    });

    return deferred.promise;
  };

  var _updateDevice = function (data) {
    var deferred = $q.defer();
    var authData = UserService.getAuthData();

    var deviceData = {
      "device_id": $cordovaDevice.getUUID(),
      "logged_user": authData.id,
      "pushwooshtoken": data.pushwooshtoken
    };

    $http.post($rootScope.urlBackend + '/device/', deviceData).success(function (response) {
      deferred.resolve(response);
    }).error(function (error) {
      $rootScope.debugInfo({'m':'error on update device', 'd':error});
      deferred.reject(error);
    });

    return deferred.promise;
  };

  var __getEmailValidationError = function(email) {
      var emailRegexp = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
      if (!email) {
        return 'Please enter your email';
      } else
      if (!emailRegexp.test(email)) {
        return 'Email is not valid';
      }

      return null;
    };

  var _saveFeedback = function(feedBackData){
    var deferred = $q.defer();
    var authData = UserService.getAuthData();
    var emailErrorMessage = __getEmailValidationError(feedBackData.email);

    if (emailErrorMessage !== null) {
      setTimeout(function() {
        deferred.resolve({
          status: 'error',
          message: emailErrorMessage
        });
      }, 0);
      return deferred.promise;
    }

    $http.defaults.headers.common['Authorization'] = authData.token;
    feedBackData.username = authData.username;

    $http.post($rootScope.urlBackend + '/user/feedback', feedBackData).success(function (response) {
      deferred.resolve(response);
    }).error(function (err, status) {
      deferred.reject(err);
    });

    return deferred.promise;
  };

  var _getContactsLocal = function(){
    var deferred = $q.defer();

    deferred.resolve([]);

    return deferred.promise;
  };

  var _getContacts = function(numbers){
    var deferred = $q.defer();
    var authData = UserService.getAuthData();

    $http.defaults.headers.common['Authorization'] = authData.token;

    $http.post($rootScope.urlBackend + '/user/contacts', {contacts: numbers}).success(function (response) {
      //localStorageService.set('contacts', { contacts: response.users });
      deferred.resolve(response);
    }).error(function (err, status) {
        deferred.reject(err);
    });

    return deferred.promise;
  };

  var _getPhoneContacts = function() {
    var deferred          = $q.defer(),
        formattedContacts = [],
        priority          = ConfigService.phoneContactsTypePriority,
        fields            = ConfigService.contactFields,
        formattedContact,
        name,
        picture;

    $cordovaContacts.find({multiple:true, fields: fields}).then(function(contacts){

      _.each(contacts, function(contact) {
        var mobileNumber,
            i;

        if (
          (_.isUndefined(contact.phoneNumbers) || !contact.phoneNumbers || contact.phoneNumbers.length==0)
          || (_.isUndefined(contact.name) || (contact.name && _.isUndefined(contact.name.formatted)) || (contact.name && contact.name.formatted == ''))
        ) {
          return; // skip such records
        }

        if (contact.phoneNumbers.length > 1) {
          for (i = 0; i < priority.length; i++) {
            mobileNumber = _.findWhere(contact.phoneNumbers, {type: priority[i]});
            if (!_.isUndefined(mobileNumber)) break;
          }
          if (_.isUndefined(mobileNumber)) {
            mobileNumber = _.first(contact.phoneNumbers);
          }
        } else {
          mobileNumber = _.first(contact.phoneNumbers);
        }
        formattedContact = {mobilenumber: mobileNumber.value, type: mobileNumber.type};
        name = (contact.name && contact.name.formatted) !== null ? contact.name.formatted : formattedContact.mobilenumber;
        picture = _.findWhere(contact.photos, {type: 'url'});

        formattedContact.pic = (!_.isUndefined(picture) && !_.isEmpty(picture) && picture.value.length) ? picture.value : 'img/default_avatar.jpg';
        formattedContact.name = name;
        formattedContacts.push(formattedContact);
      });

      deferred.resolve(formattedContacts);
    }).catch(function(error) {
      deferred.reject(error);
    });

    return deferred.promise;
  };


  _.extend(settingsServiceFactory, {
    changeNumbers: _changeNumbers,
    removeUser: _removeUser,
    fileTo: _fileTo,
    videoTo: _videoTo,
    uploadImage: _uploadImage,
    saveProfile: _saveProfile,
    saveFeedback: _saveFeedback,
    getContacts: _getContacts,
    getContactsLocal: _getContactsLocal,
    getPhoneContacts: _getPhoneContacts,
    updateDevice: _updateDevice,
    uploadCropImage: _uploadCropImage
  });

  return settingsServiceFactory;
}]);
