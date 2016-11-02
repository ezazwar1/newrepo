angular.module('fun.services', ['restangular']);
angular.module('fun.config', []);
angular.module('fun.controllers', ['ionic', 'fun.services', 'fun.config', 'gettext']);
angular.module('fun.sandbox', ['ionic', 'fun.services']);
