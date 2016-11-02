angular.module('swMobileApp').factory('WorkoutService', function ($ionicPlatform, $cordovaFile, $cordovaFileTransfer, $timeout, $ionicLoading, $q, $window, $log) {

    const _LF_UNLOCKED_EXERCISES_KEY = 'unlockedExercises';
    const _LF_EXERCISE_MANAGER_KEY = 'exerciseDownloadManager';
    const _DOWNLOAD_CURRENT_VERSION = 2;

    const _LIST_KEY_KEYFRAME_FIRST = 'keyframe-first-';
    const _LIST_KEY_KEYFRAME_MIDDLE = 'keyframe-middle-';
    const _LIST_KEY_VIDEO = 'keyframe-video-';
    const _LIST_KEY_AUDIO = 'keyframe-audio-';

    var exerciseFolderName = 'exercises/';
    var videoFolderName = 'video/';
    var audioFolderName = 'audio/';
    var keyframeStartFolderName = 'keyframe-first/';
    var keyframeMiddleFolderName = 'keyframe-middle/';

    var _downloadStateManager = {};

    var _getDownloadedFilenames = function () {
        $log.info("_getDownloadedFilenames()");
        var deviceBasePath;
        var deviceKeyframeStartFolderPath,
            deviceKeyframeMiddleFolderPath,
            deviceVideoFolderPath,
            deviceAudioFolderPath,
            localeFolder;

        return $ionicPlatform.ready(function () {
            deviceBasePath = _getDownloadsDirectory();
            deviceKeyframeStartFolderPath = deviceBasePath + exerciseFolderName + keyframeStartFolderName;
            deviceKeyframeMiddleFolderPath = deviceBasePath + exerciseFolderName + keyframeMiddleFolderName;
            deviceVideoFolderPath = deviceBasePath + exerciseFolderName + videoFolderName;
            deviceAudioFolderPath = deviceBasePath + exerciseFolderName + audioFolderName;
            localeFolder = PersonalData.GetUserSettings.preferredLanguage.toLowerCase();
            return [];
        })
            .then(function (allThusFar) {
                return $q.all([
                    _getDirectoryList(deviceKeyframeStartFolderPath, _LIST_KEY_KEYFRAME_FIRST),
                    _getDirectoryList(deviceKeyframeMiddleFolderPath, _LIST_KEY_KEYFRAME_MIDDLE),
                    _getDirectoryList(deviceVideoFolderPath, _LIST_KEY_VIDEO),
                    _getDirectoryList(deviceAudioFolderPath + localeFolder, _LIST_KEY_AUDIO + localeFolder + '-')
                ])
                    .then(function (qAllResolved) {
                        // $log.debug("qAllResolved", qAllResolved);
                        for (var i = 0, len = qAllResolved.length; i < len; i++) {
                            allThusFar = Array.prototype.concat(allThusFar, qAllResolved[i]);
                        }
                        return allThusFar
                    });
            })
            .then(function (allThusFar) {
                // $log.debug("allThusFar", allThusFar);
                return _.filter(allThusFar, function (v) {
                    return angular.isDefined(v);
                });
            })
            .catch(function (rejection) {
                $log.warn("Unable to get download filenames; assuming nothing should have been found", rejection);
                return [];
            });
    };

    var _getDirectoryList = function (folderUri, listKey) {
        $log.info("_getDirectoryList()");
        if (angular.isUndefined(listKey)) {
            $log.error("A list key must be provided");
            return;
        }
        var directoryList = [];
        var deferred = $q.defer();

        $window.resolveLocalFileSystemURL(folderUri,
            function onSuccess(dirEntry) {
                function onReadEntriesSuccess(entries) {
                    var i;
                    for (i = 0; i < entries.length; i++) {
                        var filename = entries[i].name;
                        // $log.debug("Dir list entry", listKey + filename);
                        directoryList.push(listKey + filename);
                    }
                    deferred.resolve(directoryList);
                }

                function onReadEntriesFail(error) {
                    $log.warn("Unable to list directory contents", error);
                    deferred.reject({error: error});
                }

                $log.debug("Directory found");
                var directoryReader = dirEntry.createReader();
                $log.debug("dirEntry", dirEntry);
                directoryReader.readEntries(onReadEntriesSuccess, onReadEntriesFail);
            },
            function onFail(error) {
                $log.warn("Directory not found");
                deferred.reject({error: error});
            });
        return deferred.promise;
    };

    var _manageDownloads = function () {
        $log.info("_manageDownloads()");

        // $log.warn("Supressing download manager");
        // return;

        return _getUnlockedExercises()
            .then(function (unlockedExercises) {
                var hasUnlockedExercises = angular.isObject(unlockedExercises);
                $log.debug("hasUnlockedExercises: " + hasUnlockedExercises);
                if (hasUnlockedExercises) {

                    // $log.warn("Supressing download manager downloading; faking didDownload as FALSE");
                    // return {didDownload: false};

                    return localforage.getItem(_LF_EXERCISE_MANAGER_KEY)
                        .then(function (lfValue) {
                            $log.debug("lfValue: " + _LF_EXERCISE_MANAGER_KEY, lfValue);
                            if (angular.isObject(lfValue) && lfValue.version >= _DOWNLOAD_CURRENT_VERSION) {
                                $log.info("Do NOT need to redo unlock and download");
                                return _downloadMissingUnlockedExercises()
                                    .then(function (downloadResult) {
                                        return {
                                            downloadResult: downloadResult,
                                            isCurrentVersion: true
                                        };
                                    })
                            } else {
                                $log.info("Need to redo unlock and download");
                                return _deleteAllDownloadedExercises()
                                    .then(function (deleteResult) {
                                        $log.debug("Delete result", deleteResult);
                                        return localforage.setItem(_LF_EXERCISE_MANAGER_KEY, {version: _DOWNLOAD_CURRENT_VERSION})
                                    })
                                    .then(function (setDmVersionResult) {
                                        $log.debug("setDmVersionResult " + _LF_EXERCISE_MANAGER_KEY, setDmVersionResult);
                                        return;
                                    })
                                    .then(_downloadMissingUnlockedExercises)
                                    .then(function (downloadResult) {
                                        $log.debug("_downloadMissingUnlockedExercises() result", downloadResult);
                                        return {
                                            downloadResult: downloadResult,
                                            isCurrentVersion: true
                                        };
                                    });
                            }
                        })
                } else {
                    return {hasUnlockedExercises: hasUnlockedExercises};
                }
            })
            .catch(function (rejection) {
                return {isCurrentVersion: false, rejection: rejection};
            });
    };

    var _getUnlockedExercises = function () {
        return localforage.getItem(_LF_UNLOCKED_EXERCISES_KEY)
            .then(function (lfValue) {
                var lfValueCountDisplay = lfValue ? "(" + Object.keys(lfValue).length + ")" : "";
                $log.debug("lfValue for '" + _LF_UNLOCKED_EXERCISES_KEY + "'" + lfValueCountDisplay, lfValue);
                if (lfValue) {
                    Object.keys(lfValue).forEach(function (key) {
                        lfValue[key].unlocked = true;
                    });
                }
                return lfValue;
            })
            .catch(function (reject) {
                $log.warn("_getUserExercises() > catch()", reject);
            });
    };

    var _getUserExercises = function () {
        $log.info("_getUserExercises()");

        // $log.warn("Supressing unlocked exercises > Fixes lag (when MD is also suppressed)");
        // return $q.when(_getBundledExercises());

        return $q.all([_getUnlockedExercises(), _getDownloadedFilenames()])
            .then(function (allResolved) {
                var unlockedExercises = allResolved[0],
                    downloadedFilenames = allResolved[1];
                // $log.debug("_getUserExercises() > unlockedExercises", unlockedExercises);
                // $log.debug("_getUserExercises() > downloadedFilenames", downloadedFilenames);

                var readyUnlockedExercises = {};
                var readyCheckPromises = [];
                _.each(unlockedExercises, function (unlockedExercise, key) {
                    //$log.debug("unlockedExercise", unlockedExercise);
                    //$log.debug("unlockedExercise key", key);
                    unlockedExercise.associativeKey = key;

                    readyCheckPromises.push(_isExerciseCompletelyDownloaded(unlockedExercise, downloadedFilenames));
                    // $log.warn("Supressing unlocked exercises checks; faking as FOUND > Fixes lag (when MD is also supressed)");
                    // readyCheckPromises.push($q.when({found: true, exercise: unlockedExercise}));
                    // $log.warn("Supressing unlocked exercises checks; faking as NOT FOUND > Fixes lag (when MD is also supressed)");
                    // readyCheckPromises.push($q.when({found: false, exercise: unlockedExercise}));

                });
                return $q.all(readyCheckPromises)
                    .then(function (resolvedValues) {
                        //$log.debug("resolvedValues", resolvedValues); // []
                        //$log.debug("resolvedValues.length", resolvedValues.length); // 55
                        _.each(resolvedValues, function (resolvedValue) {
                            //$log.debug("resolvedValue", resolvedValue);
                            if (!resolvedValue.isInProgress && resolvedValue.found) {
                                readyUnlockedExercises[resolvedValue.exercise.associativeKey] = resolvedValue.exercise;
                            }
                        });
                        $log.info("readyUnlockedExercises (" + Object.keys(readyUnlockedExercises).length + ")", readyUnlockedExercises);
                        var allBundledAndUnlockedReadyExercises = readyUnlockedExercises ? angular.extend({}, _getBundledExercises(), readyUnlockedExercises) : _getBundledExercises()
                        //$log.debug(allBundledAndUnlockedReadyExercises);
                        $log.debug("_getUserExercises() return count", Object.keys(allBundledAndUnlockedReadyExercises).length);
                        return allBundledAndUnlockedReadyExercises;
                    });
            })
            .catch(function (reject) {
                $log.warn("_getUserExercises() > catch()", reject);
            });
    };

    var _isExerciseCompletelyDownloaded = function (exercise, downloadedFilenames) {
        //$log.info("_isExerciseCompletelyDownloaded()", exercise.name);

        // $log.warn("Supressing exercises check; returning all as FOUND");
        // return $q.when({found: true, exercise: exercise});

        var videoFileName = exercise.video;
        var audioFileName = exercise.audio;
        var keyframeStartFileName = exercise.image;
        var keyframeMiddleFileName = keyframeStartFileName;

        var localeFolder = PersonalData.GetUserSettings.preferredLanguage.toLowerCase();
        var isKeyframeFirstFound = _.contains(downloadedFilenames, _LIST_KEY_KEYFRAME_FIRST + keyframeStartFileName);
        var isKeyframeMiddleFound = _.contains(downloadedFilenames, _LIST_KEY_KEYFRAME_MIDDLE + keyframeMiddleFileName);
        var isVideoFound = _.contains(downloadedFilenames, _LIST_KEY_VIDEO + videoFileName);
        var isAudioFound = _.contains(downloadedFilenames, _LIST_KEY_AUDIO + localeFolder + '-' + audioFileName);

        var isAllFilesFound = isKeyframeFirstFound
            && isKeyframeMiddleFound
            && isVideoFound
            && isAudioFound;
        return _getDownloadProgress(exercise.name, localeFolder)
            .then(function (progress) {
                return {exercise: exercise, found: isAllFilesFound, isInProgress: progress.isInProgress};
            });
    };

    var _downloadExercise = function (exercise, isNewLocale) {
        //$log.info("_downloadExercise()");
        var sourceWebUrlFolder = 'http://m.sworkit.com.s3.amazonaws.com/assets/exercises/accounts/';
        var exerciseFolderName = 'exercises/';
        var platformSpecificVideoSourceFolder = '';
        var localeFolder = PersonalData.GetUserSettings.preferredLanguage.toLowerCase();
        _setDownloadStart(exercise.name, localeFolder);
        var downloadFilePromises = [];
        if (isNewLocale !== "newlocale") {
            if (ionic.Platform.isIOS()) {
                platformSpecificVideoSourceFolder = 'ios/';
            }
            else {
                platformSpecificVideoSourceFolder = 'android/';
            }
            downloadFilePromises.push(_downloadFileToDevice(exercise.name, exercise.image, exerciseFolderName + 'keyframe-first/', sourceWebUrlFolder + 'first-frame/', 'keyframe_first'));
            downloadFilePromises.push(_downloadFileToDevice(exercise.name, exercise.image, exerciseFolderName + 'keyframe-middle/', sourceWebUrlFolder + 'middle-frame/', 'keyframe_middle'));
            downloadFilePromises.push(_downloadFileToDevice(exercise.name, exercise.video, exerciseFolderName + 'video/', sourceWebUrlFolder + platformSpecificVideoSourceFolder, 'video'));
            downloadFilePromises.push(_downloadFileToDevice(exercise.name, exercise.audio, exerciseFolderName + 'audio/en/', sourceWebUrlFolder + 'audio/en/', 'audio_en'));
        }
        if (localeFolder !== 'en') {
            downloadFilePromises.push(_downloadFileToDevice(exercise.name, exercise.audio, exerciseFolderName + 'audio/' + localeFolder + '/', sourceWebUrlFolder + 'audio/' + localeFolder + '/', 'audio_' + localeFolder));
        }
        return $q.all(downloadFilePromises)
            .then(function (resolvedValues) {
                //$log.debug("resolvedValues", resolvedValues); // []
                //$log.debug("resolvedValues.length", resolvedValues.length); // 55
                return {resolved: true, count: resolvedValues.length}
            })
            .catch(function (rejection) {
                $log.error("Download(s) rejected", rejection);
                return {resolved: false, rejection: rejection}
            });
    };

    var _downloadFileToDevice = function (exerciseName, fileName, deviceFileFolderRelativePath, sourceWebUrlFolder, downloadType) {
        $log.info("_downloadFileToDevice()");
        var deviceBasePath;
        if (!$window.device) return $q.when("Not a device");
        return $ionicPlatform.ready(function () {
            deviceBasePath = _getDownloadsDirectory();
            //$log.debug("deviceBasePath", deviceBasePath);
        })
            .then(function () {
                //$log.debug("then() createDir() device folders", deviceFileFolderRelativePath);
                // NB: This can handle up to three folder levels, e.g., '.../exercise/audio/en/'
                var folderNames = deviceFileFolderRelativePath.split('/');
                folderNames.pop();
                //$log.debug("folderNames", folderNames);
                return $cordovaFile.createDir(deviceBasePath, folderNames[0], true)
                    .then(function () {
                        return $cordovaFile.createDir(deviceBasePath + folderNames[0] + '/', folderNames[1], true)
                            .then(function (firstDir) {
                                if (folderNames.length > 2) {
                                    return $cordovaFile.createDir(deviceBasePath + folderNames[0] + '/' + folderNames[1] + '/', folderNames[2], true);
                                } else {
                                    return firstDir;
                                }
                            });
                    });
            })
            .then(function (fileDir) {
                // TODO: Could we just use fileDir instead of recreating deviceFileFolderPath here, so the code could never get the path wrong?
                //$log.debug("then() createFile() fileName", [fileName, fileDir]);
                var deviceFileFolderPath = deviceBasePath + deviceFileFolderRelativePath + '/';
                return $cordovaFile.createFile(deviceFileFolderPath, fileName, true);
            })
            .then(function (newFile) {
                //$log.debug("then() downloadFile() newFile", newFile);
                var sourceWebUrl = sourceWebUrlFolder + fileName;
                //$log.debug("sourceWebUrl", sourceWebUrl);
                // TODO: Try this without trustAllHosts as true if we want to be more secure
                return $cordovaFileTransfer.download(sourceWebUrl, newFile.nativeURL, {
                    headers: {Connection: "close"}
                }, true);
            })
            .then(function (result) {
                // $log.debug("download file SUCCESS", result);
            }, function (err) {
                $log.error("download file ERROR");
                $log.error(err);
                _setDownloadFail(exerciseName, downloadType);
            }, function (progress) {
                // NB: Use with caution, if at all; Constant progress updates really slow down the download process
                //$log.info("Download PROGRESS: " + ((progress.loaded / progress.total) * 100).toFixed() + "%");
                //$log.info(progress);
                if (progress.loaded === progress.total) {
                    //$log.info("downloadType()", downloadType);
                    _setDownloadComplete(exerciseName, downloadType);
                }
            });
    };

    var _getDownloadsDirectory = function () {
        //$log.info("_getDownloadsDirectory()");
        if ($window.cordova && $window.cordova.file) {
            var mostReliableDirectory = cordova.file.externalDataDirectory ? cordova.file.externalDataDirectory : cordova.file.dataDirectory;
            //$log.debug("mostReliableDirectory", mostReliableDirectory);
            return mostReliableDirectory;
        } else {
            return false;
        }
    };

    var _getBundledExercises = function () {
        return exerciseObject;
    };

    var _getAllExercises = function () {
        $log.info("_getAllExercises()");
        var allExercises = {};

        function getAllStandardExercises() {
            return $q.all(_.each($window.exerciseObject, pushToAllExercises));
        }

        function getAllAccountExercises() {
            return $q.all(_.each($window.exerciseUnlockedAccountObject, pushToAllExercises));
        }

        function getAllLowImpactExercises() {
            return $q.all(_.each($window.exerciseUnlockedLowImpactObject, pushToAllExercises));
        }

        function pushToAllExercises(pushedExercise, pushedKey) {
            allExercises[pushedKey] = pushedExercise;
        }

        var deferred = $q.defer();
        getAllStandardExercises()
            .then(getAllAccountExercises)
            .then(getAllLowImpactExercises)
            .then(
                function () {
                    deferred.resolve(allExercises);
                }
            );
        return deferred.promise;
    };

    var _isFileReallyThere = $window._isFileReallyThere = function (fullFilePath) {
        //$log.info("_isFileReallyThere()");
        var checkFile2Deferred = $q.defer();
        if ($window.resolveLocalFileSystemURL) {
            $window.resolveLocalFileSystemURL(fullFilePath,
                function (resultFound) {
                    //$log.debug("resolveLocalFileSystemURL() > Found", resultFound);
                    resultFound.file(function (file) {
                        var isFileWithContent = file.size > 0;
                        if (isFileWithContent) {
                            checkFile2Deferred.resolve(file);
                        } else {
                            checkFile2Deferred.reject(file);
                        }
                    });
                }, function (resultMissing) {
                    //$log.debug("resolveLocalFileSystemURL() > Missing", resultMissing);
                    checkFile2Deferred.reject(resultMissing);
                }
            );
        } else {
            checkFile2Deferred.reject("Feature detection FALSE: $window.resolveLocalFileSystemURL");
        }
        return checkFile2Deferred.promise;
    };

    var _setDownloadStart = function (exerciseName, localeFolder) {
        //$log.info("_setDownloadStart()");
        _downloadStateManager[exerciseName] = {
            keyframe_first: {isStarted: true},
            keyframe_middle: {isStarted: true},
            video: {isStarted: true},
            audio_en: {isStarted: true}
        };
        if (localeFolder && localeFolder !== 'en') {
            _downloadStateManager[exerciseName]['audio_' + localeFolder] = {isStarted: true};
        }
    };

    var _setDownloadComplete = function (exerciseName, downloadType) {
        $log.info("_setDownloadComplete(): '" + exerciseName + "'");
        _downloadStateManager[exerciseName][downloadType].isComplete = true;
    };

    var _setDownloadFail = function (exerciseName, downloadType) {
        $log.info("_setDownloadFail(): '" + exerciseName + "'");
        _downloadStateManager[exerciseName][downloadType].isFailed = true;
        _downloadStateManager[exerciseName][downloadType].isComplete = true;
    };

    var _getDownloadStateManager = function () {
        return _downloadStateManager;
    };

    $window.testGetDownloadStateManager = _getDownloadStateManager;

    var _getDownloadProgress = function (exerciseName, localeFolder) {
        //$log.info("_getDownloadProgress()");
        var deferred = $q.defer();
        var isInProgress = false;
        if (_downloadStateManager[exerciseName]) {
            isInProgress = (_downloadStateManager[exerciseName].keyframe_first.isStarted && !(_downloadStateManager[exerciseName].keyframe_first.isComplete))
                || (_downloadStateManager[exerciseName].keyframe_middle.isStarted && !(_downloadStateManager[exerciseName].keyframe_middle.isComplete))
                || (_downloadStateManager[exerciseName].video.isStarted && !(_downloadStateManager[exerciseName].video.isComplete))
                || (_downloadStateManager[exerciseName].audio_en.isStarted && !(_downloadStateManager[exerciseName].audio_en.isComplete))
                || (
                    localeFolder && localeFolder !== 'en'
                    && _downloadStateManager[exerciseName]['audio_' + localeFolder].isStarted
                    && !(_downloadStateManager[exerciseName]['audio_' + localeFolder].isComplete)
                );
        }
        deferred.resolve({isInProgress: isInProgress});
        return deferred.promise;
    };

    var _downloadMissingUnlockedExercises = function (isNewLocale) {
        $log.info("_downloadMissingUnlockedExercises()");
        return $q.all([_getUnlockedExercises(), _getDownloadedFilenames()])
            .then(function (allResolved) {
                var unlockedExercises = allResolved[0],
                    downloadedFilenames = allResolved[1];
                // $log.debug("_downloadMissingUnlockedExercises() > unlockedExercises", unlockedExercises);
                // $log.debug("_downloadMissingUnlockedExercises() > downloadedFilenames", downloadedFilenames);
                var readyCheckPromises = [];
                _.each(unlockedExercises, function (exercise) {
                    //$log.debug("each unlockedExercises", exercise);
                    var unlockAccountExerciseName = 'BICYCLE2';
                    var unlockLowImpactExerciseName = 'SIDELEGRAISESR';
                    // if (exercise.name === unlockAccountExerciseName || exercise.name === unlockLowImpactExerciseName) {
                    readyCheckPromises.push(
                        _isExerciseCompletelyDownloaded(exercise, downloadedFilenames)
                            .then(function (isExerciseCompletelyDownloaded) {
                                //$log.debug("isExerciseCompletelyDownloaded", isExerciseCompletelyDownloaded);
                                if (isExerciseCompletelyDownloaded.isInProgress) {
                                    $log.info("Download in-progress for '" + exercise.name + "'. Skipping for now.");
                                    return;
                                } else if (!isExerciseCompletelyDownloaded.found || isNewLocale === "newlocale") {
                                    $log.info("Need to download '" + exercise.name + "'");
                                    return _downloadExercise(exercise);
                                } else {
                                    $log.info("Already have '" + exercise.name + "'");
                                    var deferred = $q.defer();
                                    deferred.resolve(exercise);
                                    return deferred.promise;
                                }
                            })
                    );
                    // } else {
                    //    $log.debug("Skipping download for exercise name: " + exercise.name);
                    // }
                });
                return readyCheckPromises;
            })
            .then(function (readyCheckPromises) {
                $log.debug("readyCheckPromises.length TO BE RESOLVED", readyCheckPromises.length);
                return $q.all(readyCheckPromises)
                    .then(function (resolvedValues) {
                        $log.debug("readyCheckPromises.length RESOLVED (should match 'TO BE' above, whether download successful or not)", readyCheckPromises.length);
                        //$log.debug("resolvedValues", resolvedValues); // []
                        $log.debug("resolvedValues.length", resolvedValues.length); // 55
                        return {resolved: true, count: resolvedValues.length}
                    });
            })
            .catch(function (rejection) {
                $log.warn("downloadUnlockedExercises > catch()", rejection);
                _downloadStateManager
                return {resolved: false, rejection: rejection}
            });
    };

    var _deleteAllDownloadedExercises = function () {
        $log.info("_deleteAllDownloadedExercises()");
        var deviceBasePath;
        var exerciseFolderName = 'exercises';
        return $ionicPlatform.ready(function () {
            deviceBasePath = _getDownloadsDirectory();
            $log.debug("deviceBasePath", deviceBasePath);
        })
            .then(function () {
                $log.debug("then() removeRecursively()", deviceBasePath + ' + ' + exerciseFolderName);
                if (!$window.device) return $q.when(true);
                return $cordovaFile.removeRecursively(deviceBasePath, exerciseFolderName)
                    .then(function () {
                        $log.debug("Folder existed, and was deleted");
                        return true;
                    })
                    .catch(function (error) {
                        if (error.code === 1) {
                            $log.debug("Folder did NOT exist");
                            return true;
                        } else {
                            $log.error("Error deleting folder '" + deviceBasePath + ' + ' + exerciseFolderName + "'", error);
                            return false;
                        }
                    });
            })
            .catch(function (reject) {
                $log.warn("deleteAllDownloadedExercises() > catch()", reject);
            })
            .finally(function () {
                $log.info("Delete COMPLETE");
            });
    };

    var _getExercisesByCategory = function (userExercises, categoryName) {
        var arr = [];
        for (var exercise in userExercises) {
            if (userExercises[exercise].category == categoryName) {
                arr.push(userExercises[exercise])
            }
        }
        arr.sort(function (a, b) {
            var textA = a.name.toUpperCase();
            var textB = b.name.toUpperCase();
            return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
        });
        return arr;
    };

    var _unlockForGroupPro = function () {
        $log.info("_unlockForGroupPro()");
        return _unlockForSubscription();
    };

    var _unlockForCreateUserAccount = function () {
        $log.info("_unlockForCreateUserAccount()");
        return _getUnlockedExercises()
            .then(function (alreadyUnlockedExercises) {
                $log.debug("alreadyUnlockedExercises", alreadyUnlockedExercises);
                return angular.extend({}, alreadyUnlockedExercises, exerciseUnlockedAccountObject);
            })
            .then(function (mergedExercises) {
                return localforage.setItem(_LF_UNLOCKED_EXERCISES_KEY, mergedExercises)
                    .then(function (itemSet) {
                        $log.info("Unlock COMPLETE for " + Object.keys(exerciseUnlockedAccountObject).length + " exercises");
                        return true;
                    });
            })
            .catch(function (reject) {
                $log.warn("unlockForCreateUserAccount() > catch()", reject);
            })
    };

    var _unlockForSubscription = function () {
        $log.info("_unlockForSubscription()");
        return _getUnlockedExercises()
            .then(function (alreadyUnlockedExercises) {
                $log.debug("alreadyUnlockedExercises", alreadyUnlockedExercises);
                return angular.extend({}, alreadyUnlockedExercises, exerciseUnlockedLowImpactObject);
            })
            .then(function (mergedExercises) {
                return localforage.setItem(_LF_UNLOCKED_EXERCISES_KEY, mergedExercises)
                    .then(function (itemSet) {
                        $log.info("Unlock COMPLETE for " + Object.keys(exerciseUnlockedLowImpactObject).length + " exercises");
                        return true;
                    });
            })
            .catch(function (reject) {
                $log.warn("_unlockForSubscription() > catch()", reject);
            })
    };

    var _lockForLogOutAccount = function () {
        $log.info("_lockForLogOutAccount()");
        localforage.removeItem(_LF_UNLOCKED_EXERCISES_KEY);
    };

    var _lockForGroupCodeRemove = function () {
        $log.info("_lockForGroupCodeRemove()");
        return _getUnlockedExercises()
            .then(function (alreadyUnlockedExercises) {
                var newUnlockedExercises = {};
                Object.keys(alreadyUnlockedExercises).forEach(function (key) {
                    if (!alreadyUnlockedExercises[key].isLowImpact) {
                        newUnlockedExercises[key] = alreadyUnlockedExercises[key];
                    }
                });
                return localforage.setItem(_LF_UNLOCKED_EXERCISES_KEY, newUnlockedExercises)
                    .then(function (itemSet) {
                        $log.info("Re-lock COMPLETE for " + _LF_UNLOCKED_EXERCISES_KEY + ", new size", Object.keys(newUnlockedExercises).length);
                        return true;
                    });
            })
    };

    // TODO: Remove this logging after we've thoroughly tested _getDownloadsDirectory()
    $ionicPlatform.ready(function () {
        $log.info("Download Directory Debug"); // Something unique to search LogCat messages
        //$log.debug("$window.device", $window.device);
        //$log.debug("$window.device as Boolean", $window.device ? true : false);
        //$log.debug("ionic.Platform.device()", ionic.Platform.device());
        //$log.debug("ionic.Platform.device() === {}", ionic.Platform.device() === {});
        //$log.debug("$cordovaDevice.getDevice()", $cordovaDevice.getDevice());
        if ($window.cordova && $window.cordova.file) {
            $log.debug("cordova.file DEBUG");

            // cordova.file.dataDirectory: file:///data/data/sworkitapp.sworkit.com/files/
            $log.debug("cordova.file.dataDirectory: " + cordova.file.dataDirectory);

            // cordova.file.externalRootDirectory: file:///storage/emulated/0/
            $log.debug("cordova.file.externalRootDirectory: " + cordova.file.externalRootDirectory);

            // cordova.file.externalDataDirectory: file:///storage/emulated/0/Android/data/sworkitapp.sworkit.com/files/
            $log.debug("cordova.file.externalDataDirectory: " + cordova.file.externalDataDirectory);

            // cordova.file.externalApplicationStorageDirectory: file:///storage/emulated/0/Android/data/sworkitapp.sworkit.com/
            $log.debug("cordova.file.externalApplicationStorageDirectory: " + cordova.file.externalApplicationStorageDirectory);

            $log.debug("_getDownloadsDirectory() return", _getDownloadsDirectory());
        } else {
            $log.warn("cordova.file not found");
        }
    });

    return {
        LF_EXERCISES_KEY: _LF_UNLOCKED_EXERCISES_KEY,

        getWorkoutsByCategoryId: function (categoryId) {
            return LocalData.GetWorkoutCategories[categoryId].workoutTypes;
        },
        getWorkoutsByCategoryIdForLegacyPro: function (categoryId) {
            return LocalData.GetWorkoutCategories[categoryId].legacyProWorkouts;
        },
        getWorkoutsByCategoryIdForLegacyBasic: function (categoryId) {
            return LocalData.GetWorkoutCategories[categoryId].legacyBasicWorkouts;
        },
        getWorkoutsByCategoryIdForPremium: function (categoryId) {
            return LocalData.GetWorkoutCategories[categoryId].premiumWorkouts;
        },
        getCategoryName: function (categoryId) {
            return LocalData.GetWorkoutCategories[categoryId].fullName;
        },
        getTypeName: function (typeId) {
            return LocalData.GetWorkoutTypes[typeId].activityNames;
        },
        getWorkoutsByType: function () {
            return LocalData.GetWorkoutTypes;
        },
        getTimingIntervals: function () {
            return TimingData.GetTimingSettings;
        },
        getSevenIntervals: function () {
            return TimingData.GetSevenMinuteSettings;
        },
        getExercisesByCategory: _getExercisesByCategory,
        getUserExercises: _getUserExercises,
        getAllExercises: _getAllExercises,
        unlockForGroupPro: _unlockForGroupPro,
        unlockForCreateUserAccount: _unlockForCreateUserAccount,
        unlockForSubscription: _unlockForSubscription,
        lockForLogOutAccount: _lockForLogOutAccount,
        lockForGroupCodeRemove: _lockForGroupCodeRemove,
        downloadUnlockedExercises: _downloadMissingUnlockedExercises,
        deleteAllDownloadedExercises: _deleteAllDownloadedExercises,
        manageDownloads: _manageDownloads,
        getDownloadsDirectory: _getDownloadsDirectory,
        getDirectoryList: _getDirectoryList,
        getDownloadedFilenames: _getDownloadedFilenames
    }
});
