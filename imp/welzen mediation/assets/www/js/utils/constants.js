var myApp = angular.module('welzen');

var SERVER = 'http://welzen-api.mybluemix.net';
//var SERVER = 'http://localhost:3000';

myApp.constant('WelzenAPI', {
	URL_MEDITATIONS_VERSION: SERVER + '/version?collectionName=Meditations',
	URL_MEDITATIONS: SERVER + '/meditations',
	URL_USER: SERVER + '/users?email=XXX&password=YYY',
	URL_USER_CREATE: SERVER + '/users',
	URL_USER_UPDATE: SERVER + '/users/id',
	URL_USER_GET : SERVER + '/users/id', 
	URL_NEW_TOKEN: SERVER + '/tokens/new',
	URL_INFO_PURCHASE: SERVER + '/purchases/new',
	SERVER_URL : SERVER
});

myApp.constant('WelzenEnum', {
	FREE: 'Free',
	PREMIUM: 'Premium',
	AUDIO: 'Audio',
	VIDEO: 'Video'
});

myApp.constant('FileParams', [
	{	
		urlHead : 'WelzenAPI.URL_MEDITATIONS_VERSION',
		urlFile: "WelzenAPI.URL_MEDITATIONS",
		fileName:'meditations.json',
		hasAppFile: true,
		hasCallback: true,
		callbackFn: 'MeditationOfflineService.updateFrom'
	}
]);