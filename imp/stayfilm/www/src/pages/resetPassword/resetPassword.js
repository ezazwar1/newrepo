angular.module('fun.controllers')
	.controller('ResetPasswordController', function (
		$scope, UserServ, MiscServ, gettextCatalog, LogServ
	) {

		var log = LogServ;

		$scope.formData = {};

		$scope.resetPassword = function(form, formData) {

			if (form.$invalid) {
				return;
			}

			MiscServ.showLoading();

			UserServ.resetPassword(formData.email).then(function () {

				MiscServ.alert(gettextCatalog.getString('Por favor, verifique seu email para trocar sua senha.'), gettextCatalog.getString('Email enviado'));

				MiscServ.goTo('welcome.login');

			}, function (err) {

				log.debug(err);

				var msg = (err && err.data && err.data.message) || gettextCatalog.getString('Não foi possível trocar sua senha. Por favor, tente mais tarde.');

				MiscServ.alert(msg, gettextCatalog.getString('Ops...'));

			}).finally(function () {
				MiscServ.hideLoading();
			});
		};

	})
;
