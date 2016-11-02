'use strict';

/**
 * Services that persists and retrieves TODOs from localStorage
 */
myApp.factory('Storage', function () {
    var version = 'alpha 0.02';

    if(localStorage.getItem('betoseeApp-version') !== version) {
        localStorage.clear();

        localStorage.setItem('betoseeApp-version', version);

        console.log('Database loaded !');
    }

    return {
        get: function (key) {
            return JSON.parse(localStorage.getItem(key));
        },
        save: function(key,value){
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        },
        remove : function(key){
            localStorage.removeItem(key);
        },
        clear : function(){
            localStorage.clear();
        }
    };
});
