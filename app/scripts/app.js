'use strict';

/**
 * @ngdoc overview
 * @name pooIhmExemplesApp
 * @description
 * # pooIhmExemplesApp
 *
 * Main module of the application.
 */
angular
  .module('pooIhmExemplesApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        redirectTo: '/users'
      })
      .when('/users' , {
        templateUrl: 'views/Users/list.html',
        controller: 'UsersCtrl'
      })
      .when('/users/:userId', {
        templateUrl: 'views/Users/show.html',
        controller: 'UsersCtrl'
      })
      .when('/newUser/', {
        templateUrl: 'views/Users/show.html',
        controller: 'UsersCtrl'
      })
      .when('/projects/', {
        templateUrl: 'views/Projects/list.html',
        controller: 'ProjectsCtrl'
      })
      .when('/projects/:projectId', {
        templateUrl: 'views/Projects/show.html',
        controller: 'ProjectsCtrl'
      })
      .when('/newProject/', {
        templateUrl: 'views/Projects/show.html',
        controller: 'ProjectsCtrl'
      })
      .otherwise({
        redirectTo: '/users'
      });
  });
