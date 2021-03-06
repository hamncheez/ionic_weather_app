angular.module('weather.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  //addLocation modal
/*  $ionicModal.fromTemplateUrl('templates/addLocation.html', {
    id: '0',
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal){
    $scope.addLocationModal = modal;
  });
*/

  // Triggered in the login modal to close it
/*  $scope.closeModal = function() {
      $scope.addLocationModal.hide();
  };


  $scope.addModal = function(){
      $scope.addLocationModal.show();
  };
*/



})


.controller('GetLocationCtrl', function($scope, $ionicModal, $ionicLoading, $http, $state,  Locations, YahooApi){

    //addLocation modal
    $ionicModal.fromTemplateUrl('templates/addLocation.html', {
      id: '0',
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal){
      $scope.addLocationModal = modal;
    });




  $scope.locationInfo = {};
  $scope.searchInfo = {};

  // $ionicModal.fromTemplateUrl('templates/addLocation.html', function(modal){
  //   $scope.addLocationModal = modal;
  // });

  $scope.closeModal = function() {
      $scope.addLocationModal.hide();
  };


  $scope.addModal = function(){
      $scope.addLocationModal.show();
  };


  $scope.locations = Locations.all();

  $scope.deleteLocation = function(name){

      var index = Locations.getLocationIndex($scope.locations, 'name', name);
      if (index >-1){
        $scope.locations.splice(index, 1);
      }
      console.log($scope.locations);
      Locations.save($scope.locations);

  };

  var reset = function(){
    if($scope.locationInfo){
      $scope.locationInfo = null;
    } 
  };

  //$scope.locations = Locations.all();
 // $scope.activeLocation = Locations.getActiveLocation();

  $scope.goToLocation = function(name){

    var index = name;

    if(index == null){
      index = $scope.locationInfo.city+", "+$scope.locationInfo.region;
    }

    Locations.setActiveLocation(index);
    $state.go('app.view', {}, {reload:true});
    $scope.closeModal();
    console.log("location that should be active: "+index);
     
  };

  $scope.saveLocation = function(){
    if($scope.locations == null){
      $scope.locations = [];
    }

    var newLocation = Locations.newLocation($scope.locationInfo.city+", "+$scope.locationInfo.region);
    var ifExists = Locations.checkIfExists($scope.locations, newLocation);
    if(ifExists == true){
      alert("Already saved!"); 
    }
    else{
      $scope.locations.push(newLocation);
      Locations.save($scope.locations);
    }


    $scope.goToLocation(newLocation.name);
  }

  $scope.findZip = function(){
     $ionicLoading.show({
          template:'Looking up...'
        });
    YahooApi.yApi('location', $scope.searchInfo.query)
      .then(function(response){
        if(response.data.query.results == null){
          $scope.error = "Can't seem to find that! Try something else?";
          console.log($scope.error);
          $ionicLoading.hide();
        }
        else if(response.data.query.results.channel.location){
          $ionicLoading.hide();
          $scope.error = false;
          $scope.locationInfo = response.data.query.results.channel.location;
          console.log(JSON.stringify($scope.locationInfo));

          var workaround = 1;
          $scope.$watch('searchInfo.query', function(){
            workaround --;
            if(workaround < 0){
              reset();
            }
          });
        }
      }, function(){
      alert('ERROR! No internet connection(probably, what do I know)');
      $ionicLoading.hide();

      })

  };

 //$scope.active = Locations.getActiveLocation();
  //console.log($scope.active);
 

})
.controller('forecast', function($scope, $state,  Locations, YahooApi, $ionicLoading){

      $scope.display = false;

      $scope.show = function(){
        $ionicLoading.show({
          template:'Getting Forecast...'
        });
      };
      $scope.hide = function(){
        $ionicLoading.hide();

      }

      var active = Locations.getActiveLocation();

      $scope.weatherInfo = {};

      var getForcast = function(){

        $scope.show();

        YahooApi.yApi('*', active)
          .then(function(response){
            if(response.data.query.results == null){
              $scope.error = "Can't seem to find that city! Try something else, I guess";
              alert($scope.error);
              $scope.hide();
            }
            else if(response.data.query.results.channel.location){
              $scope.weatherInfo = response.data.query.results.channel;
              var n = $scope.weatherInfo.item.description.indexOf('<b>Forecast:</b>');
              var m = $scope.weatherInfo.item.description.indexOf('<a');
              m = m-n; //gets rid of extra info
              $scope.currentConditions = $scope.weatherInfo.item.description.substr(0, n); //parses info
              $scope.summary = $scope.weatherInfo.item.description.substr(n, m); //gets rid of extra info
              $scope.display = true; //shows cards when data is populated
              $scope.hide(); //hides loading gif
            }
          }, function(){
          alert('ERROR! No internet connection(probably, what do I know)');
          });

      }

      getForcast();

      $scope.doRefresh = function(){
        getForcast();
        $scope.$broadcast('scroll.refreshComplete');
      }

      
      $scope.more = false;
      $scope.moreText = 'Show Summary';
      $scope.showMore = function(){
        if($scope.more == false){
          $scope.more = true;
          $scope.moreText = "Hide Summary";
        }
        else{
          $scope.more = false;
          $scope.moreText = "Show Summary";
        }
      }

})



.controller('testCtrl', function($scope, YahooApi){
    YahooApi.yApi('location','nome').then(function(response){
      console.log('json return:'+JSON.stringify(response.data));
      if(response.data.query.results == null) {
        console.log('cant find');
      }
      else{
       console.log('test: '+response.data.query.results.channel.location.city);
      }

    }, function(){
      console.log('didnt connect');
    });

})
;


