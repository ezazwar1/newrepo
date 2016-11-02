'use strict';

(function (angular) {

    angular.module('znk.sat').factory('OfflineContentSrv', ['$rootScope', '$q','$http', 'LocalDatabaseSrv', 'StorageSrv', 'FirebaseRefSrv', OfflineContentSrv]);

    function OfflineContentSrv($rootScope, $q, $http, LocalDatabaseSrv, StorageSrv, FirebaseRefSrv) {
        var syncPromise = $q.when(),
            publicationsListenerRef,
            alreadyCheckedForContent;

        $rootScope.$on('auth:logout', function() {
            if (publicationsListenerRef) {
                publicationsListenerRef.off();
                publicationsListenerRef = undefined;
            }

            alreadyCheckedForContent = false;
        });

        function getUserContentSyncObj() {
            return StorageSrv.get(StorageSrv.appUserSpacePath.concat(['contentSync']),true).then(function(objOrNull) {
                return objOrNull || {};
            });
        }

        function setUserContentSyncObj(contentSync) {
            return StorageSrv.set(StorageSrv.appUserSpacePath.concat(['contentSync']), contentSync);
        }

        function getLocalContentRev() {
            return internalGetDB().then(function(db) {
                return db.get('localContentRev');
            }).then(function(contentIndex) {
                return contentIndex;
            }).catch(function(response) {
                if (response.status === 404) {
                    return {};
                }
                throw response;
            });
        }

        function setLocalContentRev(content) {
            return internalGetDB().then(function(db) {
                db.put(content, 'localContentRev');
            });
        }

        function checkForNewContent(opts) {
            if (alreadyCheckedForContent) {
                return syncPromise;
            }
            alreadyCheckedForContent = true;
            opts = opts || {};

            return getUserContentSyncObj().then(function(contentSync) {
                var ref = FirebaseRefSrv.create(StorageSrv.appPath.concat(['publications']));

                if (contentSync.publicationId) {
                    ref.startAt(contentSync.publicationId);
                }

                if (opts.silent) {
                    var silentDfd = $q.defer();
                    publicationsListenerRef = ref;
                    ref.on('value', function(snapshot) {
                        scanForNewPublication(snapshot);
                        silentDfd.resolve();
                    });
                    return silentDfd.promise;
                } else {
                    var dfd = $q.defer();
                    ref.once('value', function(initialSnapshot) {
                        scanForNewPublication(initialSnapshot).then(function(){
                            dfd.resolve();
                        }).then(function() {
                            publicationsListenerRef = ref;
                            ref.on('value', scanForNewPublication);
                        }).catch(function(err) {
                            dfd.reject(err);
                        });
                    },function(err){
                        dfd.reject(err);
                    });

                    return dfd.promise;
                }
            });
        }

        function scanForNewPublication(snapshot) {
            
            syncPromise = getUserContentSyncObj().then(function(contentSync) {
                
                var clientLatestPublication = contentSync.publicationId;
                var newPublication;
                snapshot.forEach(function(childSnapshot) {
                    var publication = childSnapshot.val();
                    publication.id = childSnapshot.key();
                    if (publication.id !== clientLatestPublication && publication.isPublic) {
                        newPublication = publication;
                    }
                });

                var userManifest = contentSync.revisionManifest;
                if (newPublication) {
                     userManifest = mergePublication(newPublication, contentSync.revisionManifest);
                }
                
                return updateLocalTo(userManifest).then(function() {
                    
                    if (newPublication) {
                        return setUserContentSyncObj({
                            publicationId: newPublication.id,
                            revisionManifest: userManifest
                        });
                    }
                }).catch(function (err) {
                    //@todo(harel) notify atatus
                    

                    return;
                    // keep the sync promise in a resolved state
                });
            });

            return syncPromise;
        }

        function downloadContent(name, rev) {
            
            var dataPromise;
            var dfd = $q.defer();
            var path = StorageSrv.appPath.concat(['content', name + '-rev-' + rev]);
            FirebaseRefSrv.create(path).once('value', function(snapshot) {
                if (snapshot.exists()) {
                    dfd.resolve(angular.fromJson(snapshot.val()));
                } else {
                    dfd.reject();
                }
            });
            dataPromise = dfd.promise;

            return dataPromise.catch(function(){
                return $q.reject(new Error('failed to download ' + name + ' rev ' + rev));
            }).then(function(contentData) {
                
                if (angular.isArray(contentData)) {
                    var contentObj = {};
                    contentObj[name] = contentData;
                    contentData = contentObj;
                }
                return contentData;
            });
        }

        function updateContent(contentName, rev, oldRevExists) {
            
            return downloadContent(contentName, rev).then(function(content) {
                
                var promise = $q.when({});
                if (oldRevExists) {
                    promise = internalGetDB().then(function(db) {
                        return db.get(contentName);
                    });
                }

                return promise.then(function(contentFromDb) {
                    
                    content._id = contentName;
                    if (contentFromDb){
                        content._rev = contentFromDb._rev;
                    }
                    else{
                        content._rev={};
                    }

                    return {
                        name: contentName,
                        rev: rev,
                        data: content
                    };
                }).catch(function(response) {
                    
                    
                });
            });
        }

        function updateLocalTo(revisionManifest) {
            var _localContentRev;
            return getLocalContentRev().then(function(localIndex) {
                _localContentRev = localIndex;
                var promises = [];
                for (var contentName in revisionManifest) {
                    // holds the existing local content revision, or undefined if the specified content doesn't exist
                    var localRev = _localContentRev[contentName];
                    if (!localRev || localRev < revisionManifest[contentName].rev) {
                        if (!localRev){
                            
                        }
                        else{
                             
                        }
                        promises.push(updateContent(contentName, revisionManifest[contentName].rev, !!localRev));
                    }
                }
                return $q.all(promises);
            }).then(function(resolvedArr) {
                
                if (!resolvedArr.length) {
                    return;
                }

                var contentArr = resolvedArr.map(function(item) {
                    return item.data;
                });

                return internalGetDB().then(function(db) {
                    return db.bulkDocs(contentArr).then(function (){
                        
                        resolvedArr.forEach(function(item) {
                            _localContentRev[item.name] = item.rev;
                        });

                        $rootScope.$broadcast('content:updated');
                        return setLocalContentRev(_localContentRev);
                    });
                });
            });
        }

        function mergePublication(publication, userManifest) {
            userManifest = userManifest || {};
            for (var contentName in publication.latestRevisions) {
                var clientRevData = userManifest[contentName];
                var newRevNumber = publication.latestRevisions[contentName].rev;
                if (!clientRevData || (!clientRevData.dontUpdate && clientRevData.rev < newRevNumber)) {
                    userManifest[contentName] = {rev: newRevNumber};
                }
            }

            return userManifest;
        }

        function internalGetDB() {
            return LocalDatabaseSrv.instance(LocalDatabaseSrv.databases.content);
        }

        function getDB() {
            return syncPromise.then(function() {
                return internalGetDB();
            });
        }

        function get(docId) {
            return getDB().then(function(db) {
                return db.get(docId);
            }).catch(function(err) {
                
                throw err;
            });
        }

        function getEntity(name, id) {
            return get(name + id);
        }

        function getAll(entityName, onlyId) {
            return getDB().then(function(db) {
                
                return db.allDocs({
                    include_docs: !onlyId, // jshint ignore:line
                    startkey: entityName,
                    endkey: entityName + '\uffff'
                });
            }).then(function(result) {
                
                return result.rows.map(function(row) {
                    if (onlyId) {
                        var id = row.id.replace(entityName, '');
                        return parseInt(id);
                    } else {
                        return row.doc;
                    }
                });
            }).catch(function(err) {
                
                return [];
            });
        }

        function getDrills() {
            return getAll('drill');
        }

        function getDrill(id) {
            return getEntity('drill', id);
        }

        function getAllDrillsIds(){
            return getAll('drill', true);
        }

        function getExam(id) {
            return getEntity('exam', id);
        }

        function getDailyOrder(id) {
            // cast to int, if forwarded from $stateParams this will be a string
            id = parseInt(id);
            return getDailyOrders().then(function (dailiesArr) {
                for (var i = 0; i < dailiesArr.length; i++) {
                    if (dailiesArr[i].orderId === id) {
                        return dailiesArr[i];
                    }
                }

                return $q.reject('daily order id not found.');
            });
        }

        function getDailyOrders() {
            
            return get('exerciseorder').then(function (exerciseOrder) {
                
                return exerciseOrder.dailyOrder;
            });
        }

        function getExamsOrder(){
            
            return getExerciseOrder().then(function(exerciseOrder){
                
                return exerciseOrder.examOrder;
            });
        }

        function getTutorial(id) {
            return getEntity('tutorial', id);
        }

        function getTutorials(){
            return getAll('tutorial');
        }

        function getPractice(id) {
            return getEntity('practice', id);
        }

        function getGame(id) {
            return getEntity('game', id);
        }

        function getFlashcard(idOrIdArr) {
            if (angular.isArray(idOrIdArr)) {
                var promArr = idOrIdArr.map(function(id) {
                    return getEntity('flashcard', id);
                });
                return $q.all(promArr);
            } else {
                return getEntity('flashcard', idOrIdArr);
            }
        }

        function getAllFlashcardIds() {
            return getAll('flashcard', true);
        }

        function getPracticeInstructions() {
            return get('instructions').then(function(instructionsObj) {
                return instructionsObj.instructions;
            });
        }

        function getScoreTable() {
            return get('scoreTable');
        }

        function getCategories() {
            
            return get('category').then(function(categoryObj) {
                
                return categoryObj.category;
            });
        }

        function getPersonalizationData() {
            return get('personalization');
        }

        function getExerciseOrder() {
            return get('exerciseorder');
        }

        /**
         * mark a piece of content as one that shouldn't be updated past local revision
         * @param  {string|Array} contentNameOrArray A string, or an array of string, containing the name\s of the content to stop updating from now on
         */
        function neverUpdateRevOf(contentNameOrArray) {
            //todo: wait for syncPromise?...
            var args = (angular.isArray(contentNameOrArray) ? contentNameOrArray : [contentNameOrArray]);
            return LocalDatabaseSrv.getReadyPromise().then(function() {
                return $q.all([getUserContentSyncObj(), getLocalContentRev()]);
            }).then(function(resolvedArr) {
                var contentSync = resolvedArr[0],
                    localContentRevisions = resolvedArr[1];

                contentSync.revisionManifest = contentSync.revisionManifest || {};
                args.forEach(function(contentName) {
                    var localRev = localContentRevisions[contentName] || 1;
                    var extended = angular.extend({rev: localRev}, contentSync.revisionManifest[contentName], {dontUpdate: true});
                    contentSync.revisionManifest[contentName] = extended;
                });
                return setUserContentSyncObj(contentSync);
            });
        }

        return {
            getExam: getExam,
            getDailyOrder: getDailyOrder,
            getDailyOrders: getDailyOrders,
            getTutorial: getTutorial,
            getTutorials: getTutorials,
            getPractice: getPractice,
            getGame: getGame,
            getFlashcard: getFlashcard,
            getAllFlashcardIds: getAllFlashcardIds,
            getScoreTable: getScoreTable,
            getDrills: getDrills,
            getDrill:getDrill,
            getAllDrillsIds: getAllDrillsIds,
            getPracticeInstructions: getPracticeInstructions,
            getCategories: getCategories,
            getPersonalizationData: getPersonalizationData,
            getExerciseOrder: getExerciseOrder,
            checkForNewContent: checkForNewContent,
            neverUpdateRevOf: neverUpdateRevOf,
            getExamsOrder: getExamsOrder
        };
    }

})(angular);
