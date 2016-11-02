'use strict';

(function(angular) {

   angular.module('znk.sat').factory('ExpansionSrcSrv', [
       'ENV',
       function(ENV) {

           var useApkExp = ionic.Platform.isIOS() ? false :  ENV.useApkExp;

           var ExpansionSrcSrv = {
               androidFolder: 'content://com.zinkerz.zinkerzsat/',
               localFolder: 'assets/'
           };

           ExpansionSrcSrv.getExpansionSrc = function(url){
               if(useApkExp){
                   var assetsIndex = url.indexOf(ExpansionSrcSrv.localFolder);
                   url = ExpansionSrcSrv.androidFolder + url.substr(assetsIndex);
               }

               return url;
           };

           return ExpansionSrcSrv;
       }
   ]);

})(angular);