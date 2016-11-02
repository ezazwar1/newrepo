angular.module('fun.controllers')
	.controller('SettingsController', function (
		$scope, LogServ, SessionServ, UserServ,
		MiscServ, $timeout, gettextCatalog
	) {
		var log = LogServ;

		log.info('SettingsController()');

		var thisUser = SessionServ.getUser();

		if (typeof thisUser.gender === "string") {
			thisUser.gender = thisUser.gender.toLowerCase();
		}

		var originalData = {
			// credentials
			username: thisUser.username,
			email: thisUser.email,
			password: "",
			newPassword: "",
			confirmPassword: "",

			// personal
			firstName: thisUser.firstName,
			lastName: thisUser.lastName,
			gender: thisUser.gender,
			birthdayDay: parseInt(thisUser.birthday.split("-")[2], 10),
			birthdayMonth: parseInt(thisUser.birthday.split("-")[1], 10),
			birthdayYear: parseInt(thisUser.birthday.split("-")[0], 10),
			relationshipStatus: thisUser.relationshipStatus,
			city: thisUser.city,
			emailConfigs: {
				Denounced: true,
				Denouncer: true,
				FacebookMovieShare: true,
				FriendshipAccepted: true,
				FriendshipRequest: true,
				Like: true,
				MovieBestOfSelected: true,
				MovieComment: true,
				MovieCreated: true,
				StayfilmMovieShare: true,
				UserQuoted: true
			}
		};

		$scope.data = angular.extend({}, originalData);

		$scope.setPersonalFormScope = function (form) {
			$timeout(function(){
				$scope.personalForm = form.personalForm;
			}, 0);
		};

		$scope.setCredentialsFormScope = function (form) {
			$timeout(function(){
				$scope.credentialsForm = form.credentialsForm;
			}, 0);
		};

		log.debug("$scope.data", $scope.data);

		function padLeft(str, len, pad) {
			pad = typeof pad === "undefined" ? "0" : pad + "";
			str = str + "";
			while(str.length < len) {
				str = pad + str;
			}
			return str;
		}

		$scope.errorBoxPersonal = [];
		$scope.errorBoxCredentials = [];
		$scope.errorBoxPassword = [];

		var reNotAlphaNum = /[^0-9a-z]/g,
			reEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
			reNumSymbols = /[0-9\"\{\[\}\\\/\]=+!@#$%¨&*()_]/g;

		function isPersonalDataValid () {
			var invalid = [];

			$scope.errorBoxPersonal = [];

			$(".invalidated").removeClass("invalidated");

			// personal
			if ( ! $scope.data.firstName.trim()) {
				$scope.errorBoxPersonal.push("O nome deve ser preenchido.");
				invalid.push("[name='firstName']");
			}

			if ($scope.data.firstName.match(reNumSymbols)) {
				$scope.errorBoxPersonal.push("Seu nome deve conter somente letras.");
				invalid.push("[name='firstName']");
			}

			if ( ! $scope.data.lastName.trim()) {
				$scope.errorBoxPersonal.push("O sobrenome deve ser preenchido.");
				invalid.push("[name='lastName']");
			}

			if ($scope.data.lastName.match(reNumSymbols)) {
				$scope.errorBoxPersonal.push("Seu sobrenome deve conter somente letras.");
				invalid.push("[name='lastName']");
			}

			if ($scope.data.gender) {}

			if ($scope.data.relationshipStatus) {}

			if ($scope.data.city && $scope.data.city.match(reNumSymbols)) {
				$scope.errorBoxPersonal.push("Sua cidade deve conter somente letras.");
				invalid.push("[name='city']");
			}

			$(invalid.join(",")).addClass("invalidated");
			
			log.debug("invalid", invalid);

			return ! invalid.length;
		}

		function isCredentialsDataValid () {
			var invalid = [];

			$scope.errorBoxCredentials = [];

			$(".invalidated").removeClass("invalidated");

			// credentials
			
			if ($scope.data.username.match(reNotAlphaNum)) {
				// invalid chars found
				$scope.errorBoxCredentials.push("Seu nome de usuário deve conter somente letras ou números.");
				invalid.push("[name='username']");
			}

			if ( ! $scope.data.email.match(reEmail)) {
				// invalid email
				$scope.errorBoxCredentials.push("Informe um e-mail válido.");
				invalid.push("[name='email']");
			}


			$(invalid.join(",")).addClass("invalidated");
			
			log.debug("invalid", invalid);

			return ! invalid.length;
		}

		function isPasswordDataValid () {
			var invalid = [];

			$scope.errorBoxPassword = [];

			$(".invalidated").removeClass("invalidated");

			// credentials

			if ($scope.data.newPassword) {
				// caso tenha alterado a nova senha, verificar:
				// - preenchimento do campo senha atual
				// - preenchimento do campo de confirmação com a mesma senha

				if ( ! $scope.data.password) {
					// password must be greater than 3 chars
					$scope.errorBoxPassword.push("Para mudar a senha, informe a senha atual.");
					invalid.push("[name='password']");
				}

				if ($scope.data.newPassword.length < 5 || $scope.data.newPassword.length > 12) {
					// password must be between 5 chars and 12 chars inclusive
					$scope.errorBoxPassword.push("A nova senha deve ter no mínimo 5 caracteres e no máximo 12 caracteres.");
					invalid.push("[name='newPassword']");
				}

				if ($scope.data.newPassword !== $scope.data.confirmPassword) {
					// confirm password must be equal new password
					$scope.errorBoxPassword.push("Confirme sua nova senha.");
					invalid.push("[name='confirmPassword']");
				}
			}

			$(invalid.join(",")).addClass("invalidated");
			
			log.debug("invalid", invalid);

			return ! invalid.length;
		}

		$scope.savePersonalSettings = function () {
			log.debug("savePersonalSettings()", $scope.data);

			if ( ! isPersonalDataValid()) {
				log.error("PersonalData is NOT valid.");

				MiscServ.showQuickMessage(gettextCatalog.getString("Dados inválidos, verifique por favor."), 2000);

				return;
			}

			log.debug("PersonalData is valid.");

			MiscServ.showLoading();

			var params = {},
				fields = [
					"firstName",
					"lastName",
					"gender",
					"relationshipStatus",
					"city"
				];

			angular.forEach(fields, function (field) {
				params[field] = $scope.data[field];
			});

			// tratar birthday individualmente
			params.birthday = padLeft($scope.data.birthdayDay, 2) + "/" +
								padLeft($scope.data.birthdayMonth, 2) + "/" +
								padLeft($scope.data.birthdayYear, 4);

			UserServ.putUserInfo(thisUser.username, params).then(function success () {
				log.info("PersonalData saved");

				MiscServ.showQuickMessage(gettextCatalog.getString("Seus dados foram salvos."), 2000);

				SessionServ.refreshUser().then(function success () {
					log.info("PersonalData updated");
				});
			}, function failure (err) {
				log.error("Error while saving PersonalData", err);
				MiscServ.hideLoading();
			});
		};

		$scope.saveCredentialsSettings = function () {
			log.debug("saveCredentialsSettings()", $scope.data);

			if ( ! isCredentialsDataValid()) {
				log.error("CredentialsData is NOT valid.");

				MiscServ.showQuickMessage(gettextCatalog.getString("Dados inválidos, verifique por favor."), 2000);

				return;
			}

			log.debug("CredentialsData is valid.");

			MiscServ.showLoading();

			var params = {};
			var fields = [
				"username",
				"email",
			];

			angular.forEach(fields, function (field) {
				if (originalData[field] !== $scope.data[field]) {
					console.log(field + " is different, send it.");
					params[field] = $scope.data[field];
				}
			});

			if ( ! Object.keys(params).length) {
				console.log("nothing is different, just ignore");
				MiscServ.hideLoading();
				return;
			}

			log.debug("params", params);

			UserServ.putUserInfo(thisUser.username, params).then(function success () {
				log.info("CredentialsData saved");

				originalData.username = $scope.data.username;

				MiscServ.showQuickMessage(gettextCatalog.getString("Seus dados foram salvos."), 2000);

				SessionServ.refreshUser().then(function success () {
					log.info("CredentialsData updated");
				});
			}, function failure (err) {
				log.error("Error while saving CredentialsData", err);

				var invalid = [];

				if (err.data.errors2 && err.data.errors2.username) {

					invalid.push("[name='username']");

					_.forEach(err.data.errors2.username, function (objErr) {
						$scope.errorBoxCredentials.push(objErr.message);

					});
				}

				if (err.data.errors2 && err.data.errors2.email) {

					invalid.push("[name='email']");

					_.forEach(err.data.errors2.email, function (objErr) {
						$scope.errorBoxCredentials.push(objErr.message);
					});
				}

				MiscServ.hideLoading();

				if (invalid.length) {
					$(invalid.join(",")).addClass("invalidated");
				}
			});
		};

		$scope.savePasswordSettings = function () {
			log.debug("savePasswordSettings()", $scope.data);

			if ( ! isPasswordDataValid()) {
				log.error("PasswordData is NOT valid.");

				MiscServ.showQuickMessage(gettextCatalog.getString("Dados inválidos, verifique por favor."), 2000);

				return;
			}
			log.debug("PasswordData is valid.");

			MiscServ.showLoading();

			var params = {};
			var fields = [
				"password",
				"newPassword",
				"confirmPassword"
			];

			angular.forEach(fields, function (field) {
				params[field] = $scope.data[field];
			});

			// tratar birthday individualmente
			params.birthday = padLeft($scope.data.birthdayDay, 2) + "/" +
								padLeft($scope.data.birthdayMonth, 2) + "/" +
								padLeft($scope.data.birthdayYear, 4);

			log.debug("params", params);

			UserServ.putUserInfo(thisUser.username, params).then(function success () {
				log.info("PasswordData saved");

				MiscServ.showQuickMessage(gettextCatalog.getString("Seus dados foram salvos."), 2000);

				SessionServ.refreshUser().then(function success () {
					log.info("PasswordData updated");
				});
			}, function failure (err) {
				log.error("Error while saving PasswordData", err);
				
				var invalid = [];

				if (err.data.errors2 && err.data.errors2.password) {
					invalid.push("[name='password']");

					_.forEach(err.data.errors2.password, function (objErr) {
						$scope.errorBoxPassword.push(objErr.message);
					});
				}

				MiscServ.hideLoading();

				if (invalid.length) {
					$(invalid.join(",")).addClass("invalidated");
				}
			});
		};
	})
	.controller('CredentialsSettingsController', function ($scope, LogServ) {
		var log = LogServ;

		log.info('CredentialsSettingsController()');

	})
	.controller('PersonalSettingsController', function ($scope, LogServ, UserServ, MiscServ, SessionServ, gettextCatalog) {
		var log = LogServ;

		log.info('PersonalSettingsController()', $scope);

		var thisUser = SessionServ.getUser();

		$scope.thisYear = (new Date()).getFullYear();

		var emailConfigList = [
			{key: "Denounced", description: gettextCatalog.getString("Filme foi denunciado")},
			{key: "Denouncer", description: gettextCatalog.getString("Você denúnciou um filme")},
			{key: "FacebookMovieShare", description: gettextCatalog.getString("Seu filme foi compartilhado no Facebook")},
			{key: "FriendshipAccepted", description: gettextCatalog.getString("Aviso de que aceitaram seu pedido de amizade")},
			{key: "FriendshipRequest", description: gettextCatalog.getString("Aviso de que lhe solicitaram amizade")},
			{key: "Like", description: gettextCatalog.getString("Aviso de que um filme seu recebeu um YES! de alguém")},
			{key: "MovieBestOfSelected", description: gettextCatalog.getString("Aviso de que seu filme foi escolhido como Yes Of the Week")},
			{key: "MovieComment", description: gettextCatalog.getString("Aviso de que o comentaram seu filme")},
			{key: "MovieCreated", description: gettextCatalog.getString("Aviso de que seu filme foi criado")},
			{key: "StayfilmMovieShare", description: gettextCatalog.getString("Seu filme foi compartilhado no Stayfilm")},
			{key: "UserQuoted", description: gettextCatalog.getString("Você foi citado em uma mensagem")}
		];

		function deactivateEmails(list) {
			var data = $scope.data;
			var availableConfigs = Object.keys(data.emailConfigs);

			_.forEach(list, function (emailType) {
				if (_.contains(availableConfigs, emailType)) {
					$scope.data.emailConfigs[emailType] = false;
				}
			});
		}

		$scope.toggleConfig = function (emailConfig) {
			console.log("toggleConfig()", emailConfig);

			var newToggleState = $scope.data.emailConfigs[emailConfig];
			console.log("newToggleState." + emailConfig, newToggleState);

			var params;

			MiscServ.showLoading();

			if (newToggleState === true) { // enabled email
				$scope.data.emailConfigs[emailConfig] = false;

				params = {
					emailsActivate: emailConfig
				};

				UserServ.putConfig(thisUser.username, params).then(function success () {
					$scope.data.emailConfigs[emailConfig] = true;
				}, function failure (err) {
					log.error("Error while setting email config", err);
				}).finally(function () {
					MiscServ.hideLoading();
				});
			} else { // disable email
				$scope.data.emailConfigs[emailConfig] = true;

				params = {
					emailsDeactivate: emailConfig
				};
				
				UserServ.putConfig(thisUser.username, params).then(function success () {
					$scope.data.emailConfigs[emailConfig] = false;
				}, function failure (err) {
					log.error("Error while setting email config", err);
				}).finally(function () {
					MiscServ.hideLoading();
				});
			}
		};

		var params = {
			type: "DisabledEmail"
		};

		UserServ.getConfig(thisUser.username, params).then(function success (resp) {
			var list = resp.emails;

			$scope.emailConfigList = emailConfigList;

			deactivateEmails(list);

		}, function failure (err) {
			log.error("Error while fetching email config", err);
		});

		var birthdayFields = $('.birthday-field [type="number"]');

		birthdayFields.keyup(function() {
			var $this = $(this);
			var $element = $this.attr("name");
			var maxlength = parseInt($(this).attr("maxlength"), 10);
			var min = parseInt($(this).attr("min"), 10);
			var max = parseInt($(this).attr("max"), 10);

			var matchExp = new RegExp('[0-9]{1,' + maxlength + '}', 'g');
			var matches = this.value.match(matchExp);

			function setVal(val) {
				$this.val(val);
				$scope.personalForm[$element].$setViewValue(val);
			}

			if ( ! matches) {
				setVal('');
				return;
			}

			var match = matches[0];
			var matchLength = match.length;
			var matchNum = parseInt(match, 10);
		
			if (matchLength === maxlength) {
				if (matchNum < min) {
					setVal(min);
				} else if (matchNum > max) {
					setVal(max);
				} else {
					setVal(match);
				}
			} else {
				setVal(match);
			}
		});
	})
;
