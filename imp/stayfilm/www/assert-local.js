(function () {
	var assertLocalProd = true && 
		sfLocal.defaultServer == 'prod' &&
		sfLocal.pushWooshId == 'C3E3E-09B6C' &&
		sfLocal.googleProjectId == '658119204746' &&
		sfLocal.gaTrackingIds.web == 'UA-42284570-1' &&
		sfLocal.gaTrackingIds.cordova == 'UA-42284570-2'
	;

	if (assertLocalProd) {
		assertDep(2, "local.js");
	} else {
		assert("LOCAL.JS NOT LOADED");
	}
	
	assertDep(3, "assert-local.js");
})();
