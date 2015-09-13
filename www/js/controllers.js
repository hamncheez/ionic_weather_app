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


.controller('GetLocationCtrl', function($scope, $ionicModal, $http, $state,  Locations, OwmApi){

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

  $scope.deleteLocation = function(location){
      var index = Locations.getLocationIndex($scope.locations, 'zip', location);
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

  $scope.locations = Locations.all();
  $scope.activeLocation = Locations.getActiveLocation();

  $scope.goToLocation = function(zipId){
    if(zipId){
      var index = {name : Locations.getNamebyZip($scope.locations, 'zip', zipId), zip: zipId};
    }
    else{
      var index = {name : $scope.locationInfo.city.name, zip : $scope.searchInfo.zip};
    }

    Locations.setActiveLocation(index);
    $state.go('app.view', {}, {reload:true});
    $scope.closeModal();
     
  };

  $scope.saveLocation = function(){
    if($scope.locations == null){
      $scope.locations = [];
    }

    var newLocation = Locations.newLocation($scope.locationInfo.city.name, $scope.searchInfo.zip);
    var ifExists = Locations.checkIfExists($scope.locations, newLocation.zip);
    if(ifExists == true){
      alert("Already saved!"); 
    }
    else{
      $scope.locations.push(newLocation);
      Locations.save($scope.locations);
    }


    $scope.goToLocation();
  }

  $scope.findZip = function(){
  // var owmUrl = "http://api.openweathermap.org/data/2.5/forecast";
/*
    $http({
      method:'GET',
      url: owmUrl,
      params: {zip:$scope.searchInfo.zip}
    })*/

    OwmApi.getZip($scope.searchInfo.zip)

    .then(function(response){
      $scope.locationInfo = response.data;
      if($scope.locationInfo.cod == "404"){
        $scope.error = "Can't find that zip code!";
        console.log($scope.error);
      }
      else if ($scope.locationInfo.cod = "200"){
        $scope.error = false;

        var workaround = 1;
        $scope.$watch('searchInfo.zip', function(){
          workaround --;
          if(workaround < 0){
            reset();
          }
        });

      }
    }, function(){
      alert('no go');
    });

  };

 $scope.active = Locations.getActiveLocation();
  console.log($scope.active);
 

})
.controller('forecast', function($scope, $state,  Locations, OwmApi ){
 $scope.city = Locations.getActiveLocation();

})
;


