'use strict';

(function(angular) {

    angular.module('znk.sat').factory('FirebaseRefSrv', [
        '$window', 'ENV', 'AuthSrv',
        function($window, ENV, AuthSrv) {

            var _userIdPlaceholder = '$$uid';

            function joinPath(args) {
                var pathArr = [];
                for(var i=0; i < args.length; i++) {
                    var segment = args[i];

                    if( segment && angular.isArray(segment) ) {
                        segment = joinPath(args[i]);
                    } else if (segment === _userIdPlaceholder) {
                        segment = AuthSrv.authentication.uid;
                    }

                    pathArr.push(segment);
                }
                return pathArr.join('/');
            }

            function create(path) {
                var ref = new $window.Firebase(ENV.fbEndpoint);
                if(arguments.length) {
                   ref = ref.child(joinPath([].concat(Array.prototype.slice.call(arguments))));
                }
                return ref;
            }

            return {
                joinPath: joinPath,
                create: create,
                uid: _userIdPlaceholder,
                serverTimeStamp: $window.Firebase.ServerValue.TIMESTAMP
            };
        }
    ]);

})(angular);
