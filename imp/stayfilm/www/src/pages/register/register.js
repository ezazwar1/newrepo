angular.module('fun.controllers')
	.controller('RegisterController', function (
		$scope, $rootScope, LogServ, AuthServ, SessionServ, $state, CoolServ,
		UserServ, $ionicPopup, FacebookServ, $timeout, ModalServ,
		gettextCatalog, MiscServ
	) {

		var log = LogServ;

		log.info('RegisterController');

		if (SessionServ.isLogged()) {
			$state.go('main.home.feed');
		}

		$scope.userInfo = {};
		$scope.thisYear = (new Date()).getFullYear();

		$scope.formNotVerified = false;

		var maxDays = 31;
		var minAge = 13;
		var minYear = 1900;

		var maxYear = $scope.thisYear - minAge;
		$scope.dayList = [];
		// $scope.monthList = [
		// 	gettextCatalog.getString("Janeiro"),
		// 	gettextCatalog.getString("Fevereiro"),
		// 	gettextCatalog.getString("Março"),
		// 	gettextCatalog.getString("Abril"),
		// 	gettextCatalog.getString("Maio"),
		// 	gettextCatalog.getString("Junho"),
		// 	gettextCatalog.getString("Julho"),
		// 	gettextCatalog.getString("Agosto"),
		// 	gettextCatalog.getString("Setembro"),
		// 	gettextCatalog.getString("Outubro"),
		// 	gettextCatalog.getString("Novembro"),
		// 	gettextCatalog.getString("Dezembro")
		// ];
		$scope.monthList = [
			gettextCatalog.getString("Jan"),
			gettextCatalog.getString("Fev"),
			gettextCatalog.getString("Mar"),
			gettextCatalog.getString("Abr"),
			gettextCatalog.getString("Mai"),
			gettextCatalog.getString("Jun"),
			gettextCatalog.getString("Jul"),
			gettextCatalog.getString("Ago"),
			gettextCatalog.getString("Set"),
			gettextCatalog.getString("Out"),
			gettextCatalog.getString("Nov"),
			gettextCatalog.getString("Dez")
		];
		$scope.yearList = [];

		var i;
		for (i = 0; i < maxDays; i++) {
			$scope.dayList[i] = i+1;
		}

		for (i = minYear; i < maxYear; i++) {
			$scope.yearList[i - minYear] = minYear + (maxYear - i);
		}

		$scope.validBirthday = true;

		// var fieldBirthdayDay = $("[name=birthdayDay]");
		var fieldBirthdayMonth = $("[name=birthdayMonth]");
		// var fieldBirthdayYear = $("[name=birthdayYear]");

		function isValidDate(day, month, year) {
			console.log("isValidDate()", day, month, year);

			day = parseInt(day, 10);
			month = parseInt(month, 10) - 1; // month is index 0
			year = parseInt(year, 10);

			var rawDate = new Date(year, month, day);

			var parsedDay = rawDate.getDate();
			var parsedMonth = rawDate.getMonth();
			var parsedYear = rawDate.getFullYear();

			if (
				parsedDay   != day   ||
				parsedMonth != month ||
				parsedYear  != year
			) {
				return false;
			} else {
				return true;
			}
		}

		$scope.register = function (form) {
			$scope.formNotVerified = true;

			var parsedBirthdayMonth = parseInt(fieldBirthdayMonth.val(), 10) + 1;

			var name = form.name.$viewValue;
			var lastName = form.lastName.$viewValue;
			var gender = form.gender.$viewValue || "n";
			var email = form.email.$viewValue;
			var password = form.password.$viewValue;
			var birthdayDay = form.birthdayDay.$viewValue;
			var birthdayMonth = parsedBirthdayMonth;
			var birthdayYear = form.birthdayYear.$viewValue;

			if (form.$invalid) {
				log.error("Form is not valid.");

				MiscServ.showQuickMessage(gettextCatalog.getString('Por favor, verifique os seus dados.'), 1000);

				log.debug("registerDEBUG", {
					name: name,
					lastName: lastName,
					birthdayDay: birthdayDay,
					birthdayMonth: parsedBirthdayMonth,
					birthdayYear: birthdayYear,
					gender: gender,
					email: email,
					password: password
				});

				$scope.invalidBirthday = !isValidDate(birthdayDay, birthdayMonth, birthdayYear);

				form.name.$setViewValue(name);
				form.lastName.$setViewValue(lastName);
				form.birthdayDay.$setViewValue(birthdayDay);
				form.birthdayMonth.$setViewValue(birthdayMonth);
				form.birthdayYear.$setViewValue(birthdayYear);
				form.gender.$setViewValue(gender);
				form.email.$setViewValue(email);
				form.password.$setViewValue(password);

				return;
			}

			var params = {
				firstName: name,
				lastName: lastName,
				birthdayDay: birthdayDay,
				birthdayMonth: birthdayMonth,
				birthdayYear: birthdayYear,
				gender: gender,
				email: email,
				password: password
			};

			MiscServ.showLoading();

			UserServ.register(params).then(function success(data) {
				console.log("SUCCESS REGISTER", data);

				SessionServ.setIdSession(data.idSession);
				SessionServ.setUser(data.user);
				
				MiscServ.showLoading(gettextCatalog.getString('Divirta-se! ;D'), null, true);

				SessionServ.refreshNetworks().then(function () {
					$state.go('main.moviemaker.content');
					MiscServ.hideLoading();
				});

			}, function error(resp) {
				var message;

				MiscServ.hideLoading();

				if (resp.data && resp.data.errors) {
					var errors = resp.data.errors;

					if (errors.email) {
						message = errors.email[0].message;
					}

					$ionicPopup.alert({
						title: gettextCatalog.getString('Por favor, verifique os dados'),
						content: message
					});
				} else {
					$ionicPopup.alert({
						title: gettextCatalog.getString('Por favor, tente novamente.'),
						content: resp.data.message
					});
				}
			});
		};

		$scope.loginWithFacebook = function () {

			MiscServ.showLoading(null, 20000);

			MiscServ.loginWithFacebook().then(function (resp) {
				console.log('loginWithFacebook() callback', resp);

				if (resp === 'register') {

					$state.go('main.invite', {fromRegister: true});

					$rootScope.me = SessionServ.getUser();

					MiscServ.showQuickMessage(gettextCatalog.getString('Seja bem-vindo, <br>divirta-se !'), 2000);

				} else { // login
					$state.go('main.home.feed');
					$rootScope.me = SessionServ.getUser();
					$scope.updateNotifCount();
				}

			}, function (err) {

				MiscServ.hideLoading();

				var message = (err && err.data && err.data.friendlyMessage) ||  gettextCatalog.getString('Não foi possível criar sua conta usando o Facebook. Por favor, crie sua conta usando o formulário de cadastro ou tente mais tarde.');

				$ionicPopup.alert({
					title: gettextCatalog.getString('Oups...'),
					content: message
				});

				log.debug('error loginWithFacebook', err);
			});
		};

		$scope.showLegalTerms = function () {
			var modal = ModalServ.get('legal-terms');
			modal.show();
		};

		$scope.showPrivacyTerms = function () {
			var modal = ModalServ.get('privacy-terms');
			modal.show();
		};

		$timeout(function () {
			$('[disabled]').removeAttr('disabled');
		}, 1000);
	})
	.directive('validName', function() {
		return {
			require: 'ngModel',
			link: function(scope, elm, attrs, ngModel) {

				var REGEXP = /[0-9\"\{\[\}\\\/\]=+!@#$%¨&*()_]/g;

				ngModel.$parsers.unshift(function(viewValue) {
					viewValue  = viewValue || '';

					var res  = viewValue.match(REGEXP);

					if ( ! res) {
						ngModel.$setValidity('validName', true);

						return viewValue;
					} else {
						ngModel.$setValidity('validName', false);

						return undefined;
					}
				});
			}
		};
	})
;
