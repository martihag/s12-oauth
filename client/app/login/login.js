'use strict';

angular.module('oauthTestApp')
  .config(function ($stateProvider, $authProvider) {
    $authProvider.twitter({
      url: '/api/auth/twitter'
    });

    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: 'app/login/login.html',
        controller: 'LoginCtrl'
      });
  });
