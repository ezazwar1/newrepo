(function () {
	var stayalertUrl = "http://stayalert.cloudapp.net:1337";
	var stayalertActive = true;
	var user = "NO USER";
	var currentState = "NO CURRENT STATE";
	var userAgent = navigator.userAgent;
	var appContext = sfLocal.appContext || "stayfun";
	var appVersion = FUN_VERSION || "NO VERSION";

	function post(type, data, done) {
		console.log("STAYALERT::" + type + " reporting...", data);

		if ( ! stayalertUrl) {
			console.log("WRONG_URL_ERROR STAYALERT::" + type + "", stayalertUrl, data);
			return;
		}

		return $.post(stayalertUrl, data)
			.done(function (resp) {
				if (resp == "Success") {
					console.log("STAYALERT::" + type + " REPORTED!");

					if (typeof done == "function") {
						done();
					}
				} else {
					console.log("ERROR reporting STAYALERT::" + type + "", data, resp);
				}
			})
			.fail(function(resp) {
				console.log("ERROR reporting STAYALERT::" + type + "", data, resp);
			})
		;
	}

	window.Stayalert = {
		reportException: function (exception) {

			if ( ! stayalertActive) {
				return;
			}

			var data = {
				username: user,
				state: currentState,
				useragent: userAgent,
				appcontext: appContext,
				appversion: appVersion,
				stacktracegenerated: new Error(">GENERATED<").stack,

				stacktrace: exception.stack
			};

			post("Exception", data);
		},

		reportServerResponse: function (resp) {

			if ( ! stayalertActive) {
				return;
			}
			
			if (typeof resp == "undefined" || resp === null || resp === "") {
				resp = "SERVER RESPONSE NOT AVAILABLE";
			} else {
				try {
					resp = JSON.stringify(resp);
				} catch (e) {}
			}

			var data = {
				username: user,
				state: currentState,
				useragent: userAgent,
				appcontext: appContext,
				appversion: appVersion,
				stacktracegenerated: new Error(">GENERATED<").stack,

				serverresponse: resp
			};

			post("ServerResponse", data);
		},

		reportMessage: function (message) {

			if ( ! stayalertActive) {
				return;
			}

			var data = {
				username: user,
				state: currentState,
				useragent: userAgent,
				appcontext: appContext,
				appversion: appVersion,
				stacktracegenerated: new Error(">GENERATED<").stack,

				message: message
			};

			post("Message", data);
		},
		
		setUrl: function (url) {
			console.log("SET StayAlert URL", url);

			if ( ! url) {
				this.reportMessage("STAYALERT::setUrl INVALID VALUE: " + url);
				return;
			}

			stayalertUrl = url;
		},

		setActive: function (active) {
			console.log("SET StayAlert ACTIVE", active);
			stayalertActive = active;
		},
		
		setUser: function (username) {
			user = username;
		},

		setCurrentState: function (state) {
			currentState = state;
		}
	};

}());
