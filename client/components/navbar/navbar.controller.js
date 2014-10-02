'use strict';

angular.module('oauthTestApp')
  .controller('NavbarCtrl', function ($scope, $auth, $location) {
    $scope.menu = [{
      'title': 'Home',
      'link': '/'
    }];

    $scope.isAuthenticated = function() {
      return $auth.isAuthenticated();
    };

    $scope.logout = function() {
      $auth.logout().then(function() {
        console.log('Du har blitt logget ut.');
      });
    };

    $scope.isCollapsed = true;

    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });
