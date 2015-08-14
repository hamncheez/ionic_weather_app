// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('weather', ['ionic', 'weather.controllers', 'ui.validate'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.search', {
    url: '/search',
    views: {
      'menuContent': {
        templateUrl: 'templates/search.html'
      }
    }
  })

  .state('app.browse', {
      url: '/browse',
      views: {
        'menuContent': {
          templateUrl: 'templates/browse.html'
        }
      }
    })
    .state('app.playlists', {
      url: '/playlists',
      views: {
        'menuContent': {
          templateUrl: 'templates/playlists.html',
          controller: 'PlaylistsCtrl'
        }
      }
    })

  .state('app.single', {
    url: '/playlists/:playlistId',
    views: {
      'menuContent': {
        templateUrl: 'templates/playlist.html',
        controller: 'PlaylistCtrl'
      }
    }
  })

  .state('app.view', {
    url: '/view',
    views: {
      'menuContent': {
        templateUrl: 'templates/forecastView.html',
        controller: 'forecastViewCtrl'
      }
    }
  })
  
  ;
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/search');
})
.factory('Locations', function(){
  return {
    all: function(){
        var locationString = window.localStorage['locations'];
        if(locationString){
          return angular.fromJson(locationString);
        }
        return [];
      },
      save: function(locationData){
        window.localStorage['locations'] = angular.toJson(locationData);
      },
      newLocation: function(name, zip){
        return {
          name: name,
          zip: zip, 
        };
      },
      setActiveLocation: function(index){
        window.localStorage['activeLocation'] = angular.toJson(index);
      },
      getActiveLocation: function(){
        return JSON.parse(window.localStorage['activeLocation'] || '{}');
      }
    };
})
;
