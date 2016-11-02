angular.module('welzen').factory('LockService', lockService);

function lockService(userService){

	var lockService = {
		showLock : showLock
	};

	return lockService;


	function showLock(media){
	   if (!media.isPremium()){
            return false;
        }
        if (userService.isPaid()){
            return false;
        }
        return true;
	}
}