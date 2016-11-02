describe("AppIdentity", function() {

    var scope, AppIdentityService;

    beforeEach(module("common"));

    beforeEach(
        inject(
            function ($rootScope,$injector) {
                scope = $rootScope.$new();
                AppIdentityService = $injector.get('AppIdentity');
                webVersion = undefined;
                appName = "";
            }
        )
    );

    it("should return false for web web version when not web version", function() {
        webVersion = false;
        expect(AppIdentityService.isWebApp()).toBe(false);
    });

    it("should return true for web version when it is the web version", function() {
        webVersion = true;
        expect(AppIdentityService.isWebApp()).toBe(true);
    });

    it("should return true in shopper app when when checking shopper app identity", function() {
        appName = "shopper";
        expect(AppIdentityService.isShopperApp()).toBe(true);
    });

    it("should be false when checking grocery app in shopper app", function() {
        appName = "shopper";
        expect(AppIdentityService.isGroceryApp()).toBe(false);
    });

    it("should return true in grocery app when when checking grocery app identity", function() {
        appName = "grocery";
        expect(AppIdentityService.isGroceryApp()).toBe(true);
    });

    it("should be false when checking shopper app in grocery app", function() {
        appName = "grocery";
        expect(AppIdentityService.isShopperApp()).toBe(false);
    });

    it("should return false for production when localhost is in url", function() {
        var url = "http://localhost:3000";
        expect(AppIdentityService.isProduction(url)).toBe(false);
    })

    it("should return true for isLocalhost if it is localhost", function() {
        expect(AppIdentityService.isLocalhost()).toBe(true);
    })
});
