describe('Utils module', function () {
	sfLocal.CONFIG_URL = 'http://test.com';
	angular.module('fun.config').constant('CONFIG', {});

	beforeEach(module('fun.services'));

	it('Connection string', function () {

		inject(function (Utils) {
			expect(Utils.getConnectionType()).toBe('web');
		});

	});

	it('test if the browser is connected to internet', function () {

		inject(function (Utils) {
			expect(Utils.isConnected()).toBe(true);
		});

	});

	it('it is the first startup', function () {

		inject(function (Utils) {
			expect(Utils.isFirstStartup()).toBe(true);
		});
	});

	it('get config', function () {

		inject(function (Utils, $httpBackend) {

			$httpBackend
				.expect('GET', sfLocal.CONFIG_URL)
				.respond(200);

			var promise = Utils.fetchConfig();

			promise.then(function (data) {
				expect(true).toBe(true);
			});

			$httpBackend.flush();
		});
	});

	it('check session', function () {

		inject(function (Utils, $httpBackend) {

			$httpBackend
				.expect('GET', Utils.url('auth/checksession'))
				.respond(200);

			var promise = Utils.checkSession();

			promise.then(function (data) {
				expect(true).toBe(true);
			});

			$httpBackend.flush();
		});
	});

});

