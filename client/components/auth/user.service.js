'use strict';

angular.module('leMeNuApp')
  .factory('User', function($resource) {
    return $resource('/api/users/:id/:controller', {
      id: '@_id'
    }, {
      changePassword: {
        method: 'PUT',
        params: {
          controller: 'password'
        }
      },
      get: {
        method: 'GET',
        params: {
          id: 'me'
        }
      },
      UpdateTranslate: {
        method: 'POST',
        url: '/api/users/translate/update'
      },
      saveTranslate: {
        method: 'POST',
        url: '/api/users/translate'
      }
    });
  });