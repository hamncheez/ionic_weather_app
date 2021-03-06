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
  .state('app.view', {
    url: '/view',
    views: {
      'menuContent': {
        templateUrl: 'templates/forecastView.html',
        controller: 'GetLocationCtrl'
      }
    }
  })
  .state('app.test', {
    url:'/test',
    views: {
     'menuContent': {
        templateUrl: 'templates/test.html',
        controller: 'testCtrl'
     } 
    }
  })
  
  ;
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('app/view');
})
.factory('Locations', function(){
  return {
      all: function(){
          var locationString = window.localStorage['locations'];
          if(locationString){
            return angular.fromJson(locationString);
          }
          //return [];
      },
      save: function(locationData){
        window.localStorage['locations'] = angular.toJson(locationData);
      },
      newLocation: function(name){
        return {
          name: name,
         // zip: zip, 
        };
      },
      setActiveLocation: function(index){
        //window.localStorage['activeLocation'] = angular.toJson(index);
        window.localStorage['activeLocation'] = index;
      },
      getActiveLocation: function(){
        if(window.localStorage['activeLocation']){
          return window.localStorage['activeLocation'];
        }
        else{
          return "Seattle, WA"
        }

      },
      getLocationIndex: function(list, key, value){
        for (var i = 0; i < list.length; i++){
          if (list[i][key] == value){
            return i;
          }
        }
        return null;
      },
      getNamebyZip: function(list, key, value){
        for (var i = 0; i < list.length; i++){
          if (list[i][key] == value){
            return list[i].name;
          }
        }
        return null;
      },
      checkIfExists: function(list, externalCity){
        for (var i in list){
          //console.log("loop: "+list[i].name+" does it equal "+ externalCity.name+"?");
          if (list[i].name == externalCity.name){
            return true;
          }
        }
        return false;
      }
  };
})
.factory('OwmApi', function($http){
    var owmUrl = "http://api.openweathermap.org/data/2.5/forecast";
    var OwmApi = {};

    OwmApi.getZip = function(externalZip){
      return $http.get(owmUrl, {params : {zip: externalZip}});
    };
    return OwmApi;

})
.factory('YahooApi', function($http){
    var YahooApi = {};
    var yurl = function(query, locale){
      return "https://query.yahooapis.com/v1/public/yql?q=select%20"+query+"%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22"+locale+"%22)&format=json";
    }
   YahooApi.yApi = function(query, locale){
    return $http.get(yurl(query, locale));
  };

  return YahooApi;


})
;
