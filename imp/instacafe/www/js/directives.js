angular.module('instacafe.directives', [])
.directive('defaultSrc', function (ReportApi, $parse) {
    return {
        restrict : 'A',
        link: function (scope, element, attrs) {
            element.bind('error', function () {
                if (attrs.src != attrs.defaultSrc) {
                    if (attrs.type == 'photo') {
                        ReportApi.send(5, attrs.photoId);
                    } else if (attrs.type == 'account') {
                        var accountData = $parse(attrs.accountData)(scope);
                        ReportApi.update(accountData.user_id, true);
                    }
                    attrs.$set('src', attrs.defaultSrc);
                }
            });
        }
    };
});
