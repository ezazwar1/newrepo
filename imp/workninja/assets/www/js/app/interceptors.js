// Interceptors

app.config(['$httpProvider', function($httpProvider) {
  $httpProvider.interceptors.push('RequestConfigInterceptor');
  $httpProvider.interceptors.push('AuthInterceptor');
  $httpProvider.interceptors.push('ErrorInterceptor');
  $httpProvider.interceptors.push('LoadingProgressInterceptor');
}]);
