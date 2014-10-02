'use strict';

angular.module('oauthTestApp')
  .controller('LoginCtrl', function ($auth, $scope) {
    $scope.authenticate = function(provider) {
      $auth.authenticate(provider)
        .then(function() {
          console.log('LOGIN!');
        })
        .catch(function(response) {
          console.log(response);
        });
    };

  });
