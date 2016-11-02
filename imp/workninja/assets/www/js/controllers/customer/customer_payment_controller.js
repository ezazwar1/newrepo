'use strict';

app.controller('CustomerPaymentController', [
  '$rootScope',
  '$scope',
  '$state',
  '$q',
  '$ionicModal',
  '$window',
  'CREDIT_CARD_MONTHS',
  'Pin',
  'State',
  'Country',
  'settings',
  'customer',
  'Customer',
function($rootScope, $scope, $state, $q, $ionicModal, $window, CREDIT_CARD_MONTHS, Pin, State, Country, settings, customer, Customer) {

  // if ($window.cordova && $window.cordova.plugins.Keyboard) {
  //   $window.cordova.plugins.Keyboard.disableScroll(false);
  // }

  // Pin.get({customer_id: customer.id}, function(payment) {
  //   $scope.payment = payment;
  //   //console.log(JSON.stringify(payment));

  //   var states = State.query({country_id: customer.country_id});
  //   var country = Country.get({countryId: customer.country_id});

  //   $q.all([states.$promise, country.$promise]).then(function(resources) {
  //     $scope.states = resources[0];
  //     $scope.country = resources[1];

  //     if (!$scope.hasPayment()) {
  //       $scope.newCard();
  //     }
  //   });
  // });



  Customer.getPaymentDetails({customerId: customer.id}, function(payment) {
    console.log(payment);
    $scope.payment = payment;

    var states = State.query({country_id: customer.country_id});
    var country = Country.get({countryId: customer.country_id});

    $q.all([states.$promise, country.$promise]).then(function(resources) {
      $scope.states = resources[0];
      $scope.country = resources[1];

      if (!$scope.hasPayment()) {
        $scope.newCard();
      }
    });
  });

  

  $scope.CREDIT_CARD_MONTHS = CREDIT_CARD_MONTHS;

  var currentYear = new Date().getFullYear();
  $scope.CREDIT_CARD_YEARS = [currentYear];
  for (var i = 1; i < 20; i++) {
    $scope.CREDIT_CARD_YEARS.push(currentYear + i);
  }

  $scope.hasPayment = function() {
    if ($scope.payment) {
      return !!$scope.payment.card;
    }
    else {
      return true;
    }
  };

  $scope.title = function() {
    if ($scope.hasPayment()) {
      return 'Payment';
    }
    else {
      return 'Edit Payment';
    }
  };

  $scope.newCard = function() {
    $scope.usingBusinessAddress = true;

    var state = _.find($scope.states, function(s) {
      return s.id == customer.state_id
    });

    console.log(state);
    $scope.card = {
      name: customer.fullName(),
      address_line1: customer.address_1,
      address_line2: customer.address_2,
      address_city: customer.suburb,
      address_state: state.code,
      address_postcode: customer.postcode,
      address_country: $scope.country.name
    };
  };

  $scope.toggleUseBusinessAddress = function() {
    if ($scope.usingBusinessAddress) {
      $scope.usingBusinessAddress = false;
    }
    else {
      if ($window.cordova && $window.cordova.plugins.Keyboard) {
        $window.cordova.plugins.Keyboard.close();
      }
      $scope.usingBusinessAddress = true;
      var state = _.find($scope.states, function(s) {
        return s.id == customer.state_id
      });
      $scope.card.address_line1 = customer.address_1;
      $scope.card.address_line2 = customer.address_2;
      $scope.card.address_city = customer.suburb;
      $scope.card.address_state = state.code;
      $scope.card.address_postcode = customer.postcode;
      $scope.card.address_country = $scope.country.name;
    }
  };

  $scope.deleteCard = function() {
    $scope.payment = {};
    $scope.newCard();
  };

  $scope.canUpdate = function() {
    if ($scope.card) {
      var attrs = [
        $scope.card.name,
        $scope.card.number,
        $scope.card.cvc,
        $scope.card.expiry_month,
        $scope.card.expiry_year,
        $scope.card.address_line1,
        $scope.card.address_city,
        $scope.card.address_state,
        $scope.card.address_postcode
      ];
      return _.all(attrs, function(attr) {
        return !_.isBlank(attr)
      })
    }
  };

  $scope.update = function() {
    $scope.showProgressIndicator();
      customer.setCreditCardToken(settings.pin_public_key, settings.pin_mode, $scope.card).then(function(response) {
      customer.$addCard().then(function() {

        $scope.hideProgressIndicator();
        $scope.showAlert('CHA CHING', 'Payment method was added successfully');
        $scope.goMain();
      }, function(error) {
          var message = error.data && error.data.info ? error.data.info : 'We had a problem adding your card, please try again';
          $scope.showAlert('Sorry', message);

      });
    }, function(error) {

      $scope.hideProgressIndicator();
      var message = '';
      _.each(error.messages, function(m) {
        if (message.length > 0) {
          message += '<br/>';
        }
        message += m.message;
      });
      $scope.showAlert('Payment error', message);

    });
  };

  $scope.goMain = function() {
    $rootScope.clearHistory();
    $state.go('app.customer.main');
  };

  $scope.$on('destroy', function() {
    if ($window.cordova && $window.cordova.plugins.Keyboard) {
      $window.cordova.plugins.Keyboard.disableScroll(true);
    }
  });

}]);
