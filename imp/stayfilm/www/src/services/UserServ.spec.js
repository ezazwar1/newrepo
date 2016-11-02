describe('Test', function () {

	angular.module('fun.config').constant('CONFIG', {});

	var $httpBackend, $rootScope, UserServ, CONFIG;



	beforeEach(module('fun'));

	beforeEach(inject(function (_$httpBackend_, _$rootScope_, _UserServ_, _CONFIG_) {
		//console.log(_CONFIG_);

		$httpBackend = _$httpBackend_;
		$rootScope = _$rootScope_;
		UserServ = _UserServ_;
		CONFIG = _CONFIG_;
		CONFIG.wsBaseUrl = '';
	}));

	it('Test if the user is logged in', function () {
		
		$httpBackend
			.expect('GET', '/user/getFeed')
			.respond(200, {totot: 'fkdjsalk'});


		var promise = UserServ.getStories();

		promise.then(function (data) {
			expect(true).toBe(true);
		});

		$httpBackend.flush();
	});


});

