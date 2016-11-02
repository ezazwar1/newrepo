'use strict';
angular.module('stohke')
.service('userService', ['$http', 'Utils', '$q', 'STOHKE_CONFIG', 'analyticsService', 'lodash', '$localStorage', '$rootScope', function ($http, Utils, $q, _STOHKE, analyticsService, _, $localStorage, $rootScope) {
    var serverBaseUrl = Utils.getServerBaseUrl();
    var skipOffset = 0;

    // Cached user details
    var appUser = {
        hasProfile: false,
        data: null,
    };
    var profileImageLastUpdated = $localStorage.profileImageLastUpdated;
    function handleUserResults(processType, datum, callback) {
        var prunedQty =  0;
        var tempData = datum;
        // console.log('starting tempdata length', datum.length);
        _.map(tempData, function (item) {
            var shouldPrune = false;
            switch (processType) {
                case 'prune':
                    // Prune
                    if (typeof item === 'undefined') {
                        // console.log('undefined:', item);
                        return;
                    }
                    if ((!item.Pic64X64 || !item.Pic200X200)) {
                        // console.log('has no pic');
                        shouldPrune = true;
                    }
                    if ((!item.Title || item.Title.trim().length <= 0)) {
                        shouldPrune = true;
                    }
                    if (shouldPrune) {
                        // .splice(i, 1); // remove from array 
                        var removed = _.remove(datum, function (thing) {
                            return item.Id === thing.Id;
                        });
                        // console.log('just pruned: ', removed);
                        // console.log('new tempData length ',datum.length);
                        prunedQty++; // up the pruned counter
                    } else {
                        item = item;
                        item.Loading = false;
                    }
                    break;
                case 'rc':
                case 'requirementCheck':
                    // Maybe get User Details
                    // console.log('doing requirementCheck');
                    break;
            }
        });
        // console.log(datum, datum.length);
        // console.log('pruned: %s', prunedQty);
        callback(datum, prunedQty);
        return datum;
    }
    return {
        // get Users... pass through Prune and Requirements checking then return results
        getUsers: function (searchTerm, take, skip, sport, locations, type, isFeatured, clearOffset) {
            var me = this,
                moreToLoad = true,
                isFeatured = isFeatured || null,
                randomize = false;
                console.log('getUsers');
                console.log(searchTerm, take, skip, sport, locations, type, isFeatured, clearOffset);
            if (sport){
                sport = sport.toLowerCase();
            }
            // console.log(searchTerm, take, skip, sport, locations, type, callbackId);
            // Switch up the params for companies
            if (sport === 'companies' || sport === 'brands') {
                sport = null;
                type = 1;
            }

            if (sport === undefined || sport === 'all-sports' || sport === 'all sports' || sport === 'everything' || sport === 'explore' || sport === 'featured') {
                sport = null;
                type = 0;
                
                if (!searchTerm) {
                    isFeatured = true;
                    randomize = true;
                }
            }

            if (isFeatured) {
                randomize = true;
            }
            // Don't get featured if searching
            if (searchTerm) {
                isFeatured = false;
            }
            // Clear offset resets the number skipped
            skipOffset = (clearOffset ? 0 : skipOffset);

            var params = {
                    searchTerm: searchTerm,
                    take: take,
                    skip: (skip + skipOffset),
                    sports: sport,
                    locations: locations,
                    type: type,
                    isFeatured: isFeatured
                };

            var deferred = $q.defer();
            // Check to see if request can be fulfilled by cache
            // if (users[sport].length >= skip)
            $http.get(serverBaseUrl + '/api/profile/', {
                params: params,
                transformResponse: function (data) {
                    var tempData = JSON.parse(data);
                    _.map(tempData, function (item) {
                        for (var i in item) {
                            if (item.hasOwnProperty(i)) {
                                if (item[i] === '/Content/Images/tail-body.gif') {
                                    item[i] = undefined;
                                }
                            }
                        }
                        if (isFeatured) {
                            item.isFeatured = true;
                        }
                    });
                    if (randomize) {
                        tempData = Utils.shuffle(tempData);
                    }
                    return tempData;
                }
            })
            .success(function (data) {
                if (typeof data === 'object') {
                    if (data.length < take) {
                        moreToLoad = false;
                    }
                }
                var totalPruned = 0;
                data = handleUserResults('prune', data, function (returnedData, prunedQty) {
                    totalPruned += prunedQty;
                    // console.log('totalPruned:', returnedData, prunedQty);
                    // Second check
                    // console.log('get media for remaining user\'s');
                    // go through each and get media
                    // _.each(data, function () {
                    //     me.getUserMedia()
                    // })
                    data = handleUserResults('rc', data, function () {

                    });
                }); // prune
                // console.log('altered Data: ', data);
                if (totalPruned > 0) {
                    if (moreToLoad) {

                        // console.log("found %s empties", prunedQty);
                        var newSkipCount = take + skip; // offset by one
                        // set the skipOffset for the next call
                        skipOffset = skipOffset + totalPruned;
                        // redo the search to replace the skipped ones.
                        params.take = totalPruned;
                        params.skip = newSkipCount;

                        return $http.get(serverBaseUrl + '/api/profile/', {
                            params: params,
                            transformResponse: function (datas) {
                                var data = JSON.parse(datas);
                                for (var i = 0; i < data.length; i++) {
                                    data[i].Class = data[i].Type === 1 ? 'company' : 'user';
                                    data[i].Url = (data[i].Type === 1 ? '/company/' : '/user/') + data[i].Alias;
                                }
                                return data;
                            }
                        })
                        .success(
                            function (results) {
                                // What if we get another empty record? O_o
                                data.push.apply(data, results);
                                deferred.resolve(data);
                            }
                        )
                        .error( function () {
                            deferred.resolve(data);
                        });
                    } else {
                        deferred.resolve(data);
                    }
                } else {
                    deferred.resolve(data);
                }
            })
            .error(function () {
                return false;
            });
            return deferred.promise;
        },
        getUserDetails: function (alias, type) {
            if (alias === 'current' && appUser.data) {
                var tempDef = $q.defer();

                tempDef.resolve(appUser);

                return tempDef.promise;
            }
            var call,
                params = {};

            switch (type) {

            case 0:
            case 'user':
                call = 'userprofile';
                params.id = alias;
                break;
            case 1:
            case 'company':
                call = 'page';
                params.alias = alias;
                break;
            default:
                call = 'userprofile';
                params.id = alias;
                // return false;
                
            }
            return $http.get(serverBaseUrl + '/api/' + call + '/', {
                params: params,
                transformResponse: function (data) {
                    // console.log(data);
                    var tempData = JSON.parse(data);
                    if (type === 0 || type === 'user') {
                        tempData.Type = 'user';
                    } else {
                        tempData.Type = 'company';
                    }
                    for (var i in tempData) {
                        if (tempData.hasOwnProperty(i)) {
                            if (tempData[i] === '/Content/Images/tail-body.gif') {
                                tempData[i] = _STOHKE.defaultImg;
                            }
                        }
                    }   
                    return tempData;
                }
            });
        },
        getCompanyTeam: function (alias) {

            return $http.get(serverBaseUrl + "/api/page/getcompanyteam", {
                responseType: "json",
                params: {
                    userId: alias
                },
                transformResponse: function (data) {
                    if (typeof (data) == "string") {
                        data = JSON.parse(data);
                    }
                    

                    return data;
                }
            })
            .success(function (data) {
                return data;
            })
            .error(function (data) {
                // console.error(data);
                return false;
            });
        },
        getPageLikes: function (userId, take, skip, type) {
            return $http.get(serverBaseUrl + "/api/page/getpagelikes", {
                responseType: "json",
                params: {
                    id: userId,
                    take: take,
                    skip: skip,
                    pageType: type
                },
                transformResponse: function (data) {
                    if (typeof (data) == "string")
                        data = JSON.parse(data);
                    return data;
                }
            })
            .success(function (data) {
                return data;
            })
            .error(function () {
                // console.error('pageLikes error', reason);
                return false;
            });
        },
        getUserMedia: function (userId, take, skip, type, mediaId) {
            return $http.get(serverBaseUrl + '/api/usermedia/get', {
                params: {
                    userId: userId,
                    take: take,
                    skip: skip,
                    mediaType: type !== undefined ? type : 0,
                    mediaId: mediaId || null
                    // callbackId: callbackId
                },
                responseType: 'json',
                transformResponse: function (data) {
                    _.map(data, function (result) {
                        if (result && result.Url) {
                            if (result.Url.indexOf('vimeo.com') > -1) {
                                result.Url += '?badge=0&byline=0&title=0&portrait=0';
                            } else if (result.Url.indexOf('youtube.com') > -1) {
                                result.Url += '?showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&controls=0';
                            }
                        }
                    });
                    return data;
                }
            })
            .success(function (results) {
                return results;
            })
            .error(function (reason) {
                // console.error(reason);
                return false;
            });
        },
        hasProfile: function(userId) {
            userId = (userId ? userId : "current");

            return $http.get(serverBaseUrl + "/api/userprofile/hasprofile/" + userId, {
                responseType: "json",
                headers: {
                    'Access-Control-Allow-Origin': '*'
                },
                transformResponse: function(data) {
                    if (typeof (data) == "string")
                            data = JSON.parse(data);

                    return data;
                }
            })
            .success(function (data) {
                // console.log('hasProfile: ', data);
                    return data;
                })
            .error(function (data) {
                console.error(data);
                    return false;
                });
        },
        getRandomImages: function(batchSize, sports, excludeIfStohkedByUser) {
            // console.log(batchSize, sports, excludeIfStohkedByUser);
            var sParams = {
                batchSize: batchSize,
                sports: sports,
                excludeIfStohkedByUser: excludeIfStohkedByUser
            };

            return this.getRandomImagesExt(sParams);
        },
        getRandomImagesExt: function(sParams) {

            return $http.get(serverBaseUrl + "/api/mediaexplore/get", {
                params: {
                    batchSize: (sParams.batchSize || ""),
                    sports: (sParams.sports || ""),
                    excludeIfStohkedByUser: (sParams.excludeIfStohkedByUser || false),
                    isFeatured: (sParams.isFeatured || false)
                },
                headers: {
                    'Access-Control-Allow-Origin': '*'
                },
                responseType: "json",
                transformResponse: function(data) {
                    if (typeof data == "string") {
                        data = JSON.parse(data);
                    }
                    if (data[0] && data[0].Author) {
                        if (data[0].Author.Type === 0) {
                            data[0].Author.Type = 'user';
                        } else {
                            data[0].Author.Type = 'company';
                        }
                    }
                    return data;
                }
            })
            .success(function (data) {
                // console.log('getRandomImagesExt results', data);
                return data;
            })
            .error(function (result) {
                console.error(result);
                return;
            });
        },
        updateProfile: function (userProfile) {
            // console.log('updateProfile with', userProfile);
            return $http.post(serverBaseUrl + "/api/userprofile/update", userProfile, {
                responseType: "json",

                transformResponse: function(data) {
                    if (typeof (data) == "string")
                            data = JSON.parse(data);

                    return data;
                }
            })
            .success(function (data) {
                analyticsService.trackEvent('User', 'Profile', 'Details Updated');
                appUser.data = data;
                return appUser.data;
            })
            .error(function (data) {
                console.error(data);
                return;
            });
        },
        updateProfileImage: function (img) {
            if (!img) {
                return false;
            }
            var defer = $q.defer();

            function uploadPhoto(imageURI) {
                var options = new window.FileUploadOptions();
                    options.fileKey = 'file';
                    options.fileName = imageURI.substr(imageURI.lastIndexOf('/')+1);
                    options.mimeType = 'image/jpeg';
                    options.headers = {
                        'x-ms-blob-cache-control': 'public, max-age=0'
                    };

                var ft = new window.FileTransfer();
                ft.upload(imageURI, encodeURI(serverBaseUrl + '/api/userprofile/uploadprofilepic'), onSuccess, onError, options);
            }

            function onSuccess() {
                analyticsService.trackEvent('User', 'Profile', 'Profile Image Changed', null);
                profileImageLastUpdated = $localStorage.profileImageLastUpdated = new Date().getTime();
                $rootScope.$broadcast('user:profileImageUpdated', profileImageLastUpdated);

                defer.resolve(profileImageLastUpdated);
            }

            function onError(error) {
                console.error('An error has occurred: Code = ' + error.code);
                analyticsService.trackException('userProfileImageUploadFailed', false);
                defer.reject();
            }

            uploadPhoto(img);

            return defer.promise;
        },
        uploadImage: function (img) {
            if (!img) {
                return false;
            }
            var defer = $q.defer();

            function uploadPhoto(imageURI) {
                var options = new window.FileUploadOptions();
                    options.fileKey = 'file';
                    options.fileName = imageURI.substr(imageURI.lastIndexOf('/')+1);
                    options.mimeType = 'image/jpeg';

                var ft = new window.FileTransfer();
                ft.upload(imageURI, encodeURI(serverBaseUrl + '/api/usermedia/uploadimage'), onSuccess, onError, options);
            }

            function onSuccess(r) {
                var response = JSON.parse(r.response);
                analyticsService.trackEvent('User', 'Profile Gallery', 'Upload | ' + (response.Id || ''), null);

                defer.resolve(response);
            }

            function onError(error) {
                console.error('An error has occurred: Code = ' + error.code);
                analyticsService.trackException('userGalleryImageUploadFailed', false);
                defer.reject();
            }

            uploadPhoto(img);

            return defer.promise;
        },
        getFeaturedUsers: function (take, skip, sport) {
            return $http.get(serverBaseUrl + '/api/profile/', {
                params: {
                    take: take || 10,
                    skip: skip || 0,
                    sports: sport || undefined,
                    isFeatured: true,
                    type: 0,
                    searchTerm: null,
                },
                transformResponse: function (data) {
                    if (typeof data === 'string') {
                        data = JSON.parse(data);
                    }
                    data = Utils.shuffle(data);
                    for (var i in data) {
                        data[i].isFeatured = true;
                        if (data[i].Sports.length) {
                            data[i].Sports.forEach(function (sport, index) {
                                if (sport.toLowerCase().indexOf("collections") > -1) {
                                    data[i].Sports.splice(index, 1);
                                }
                            });
                        }
                    }
                    return data;
                }
            }).success(function (data, headers) {
                return data.data;
            });
        },
        getFeaturedMedia: function (take, skip) {
            var sParams = {
                take: take,
                skip: skip
            };

            return this.getFeaturedMediaExt(sParams);
        },
        getFeaturedMediaExt: function (sParams) {
            // var deferred = $q.defer();
            return $http.get(serverBaseUrl + '/api/featuredmedia/', {
                params: {
                    take: sParams.take,
                    skip: sParams.skip,
                    isFeatured: sParams.isFeatured
                },
                transformResponse: function (data) {
                    if (typeof (data) == 'string')
                        data = JSON.parse(data);
                    return data;
                }
            }).success(function (data) {
                // console.log('featured Media API results', data);
                // if (success) success(data, status, headers, config);
                return data;
            })
            .error(function (data) {
                // if (failure) failure(data, status, headers, config);
                console.error(data);
                return;
            });
            // return deferred.promise;
        },
        getFeaturedMediaInterim: function (sParams) {
            // var deferred = $q.defer();
            return $http.get(serverBaseUrl + '/Content/Files/featured.json', {
                responseType: 'json'
            })
            .success(function (data) {

                for (var i in data) {
                    data[i].forEach(function (item, index) {
                        var x = item.split('stohke.com/')[1].split('/');
                        // console.log(x);
                        data[i][index] = {
                            'Type': x[0],
                            'Alias': x[1],
                            'mediaType' : x[2],
                            'mediaId' : x[3]
                        };

                    });
                }

                return data;
            })
            .error(function (data) {
                console.error(data);
                return;
            });
            // return deferred.promise;
        },
        deleteUserMedia: function(mediaId, mediaType) {

            if (!mediaId || !mediaType) {
                return false;
            }

            return $http.get(serverBaseUrl + "/api/usermedia/delete", {
                params: {
                    id: mediaId,
                    mediaType: mediaType
                },
                responseType: "json",

                transformResponse: function (data) {
                    if (typeof (data) == "string")
                            data = JSON.parse(data);
                    return data;
                }
            })
            .success(function (data) {

                analyticsService.trackEvent('User', 'Profile Gallery', 'Delete | ' + mediaType + ' ' + mediaId);
                // console.log(data);
                return data;
            })
            .error(function (data) {
                console.error(data);
                return false;
            });
        },
        addVideoLink: function(video) {
                
            if (!video ||
                !video.url)
                return;

            return $http.post(serverBaseUrl + "/api/usermedia/addvideo", video, {
                responseType: "json",

                transformResponse: function(data) {
                    if (typeof (data) == "string")
                            data = JSON.parse(data);

                    return data;
                }
            })
            .success(function (data) {
                analyticsService.trackEvent('User', 'Profile Gallery', 'Video Add | ' + video.Url);
                // console.log(data);
                return data;
            })
            .error(function (reason) {
                console.error(reason);
                return false;
            });
        }
    };
}]);
