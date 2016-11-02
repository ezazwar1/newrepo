angular
    .module('shiptApp')
    .directive('guestAccountCallout', ['UIUtil','choosePlan','Subscription','ErrorHandler','$rootScope','FeatureService','AppAnalytics',guestAccountCallout]);

function guestAccountCallout(UIUtil,choosePlan,Subscription,ErrorHandler,$rootScope,FeatureService,AppAnalytics) {
    var guestAccount = false;
    var directive = {
        restrict: 'EA',
        template: '' +
        `<button
            ng-click="guestAccountCalloutClick()"
            class="guest-account-callout button-positive button-full button"
            aria-label="You're currently a guest. Get started!">
            Get Started!
        </div>`,
        link: function(scope, element, attrs) {
            scope.guestAccountCalloutClick = function(){
                AppAnalytics.track('guestAccountCalloutBannerClick');
                if (FeatureService.subscription()){
                    choosePlan.showModal(scope)
                        .then(function(selectedPlan){
                            UIUtil.showLoading('Saving Plan...');
                            selectedPlan.plan_id = selectedPlan.id;
                            Subscription.create(selectedPlan)
                                .then(function(data){
                                    UIUtil.hideLoading();
                                    UIUtil.showAlert('Plan Created', 'You have been subscribed to the ' + data.plan.name + ' plan.');
                                    $rootScope.$broadcast('refresh.user-data');
                                },function(error){
                                    UIUtil.hideLoading();
                                    ErrorHandler.displayShiptAPIError(error);
                                });
                        })
                } else {
                    UIUtil.showAlert("Thank you for creating an account with Shipt!","A plan is required to place an order. Visit shipt.com/join to become a member.  We can't wait to deliver to you soon!");
                }
            }
        },
        scope: { value: '='},
    };
    return directive;
}
