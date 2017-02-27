'use strict';

/**
 * @ngdoc overview
 * @name webimClientApp
 * @description
 * # webimClientApp
 *
 * Main module of the application.
 */
angular
  .module('webimClientApp', [
    'ngAnimate',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      /*
      * Page principale, choix du projet IFC à visualiser
      */
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      /*
      * Page d'informations
      */
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      /*
      * Page de visualisation
      */
      .when('/view', {
        templateUrl: 'views/view.html',
        controller: 'ViewCtrl',
        controllerAs: 'view'
      })
      /*
      * Redirection de toutes autres demandes vers l'accueil
      */
      .otherwise({
        redirectTo: '/'
      });
  });
