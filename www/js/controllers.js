angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    id: '1',
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });

  //addLocation modal
  $ionicModal.fromTemplateUrl('templates/addLocation.html', {
    id: '0',
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal){
    $scope.addLocationModal = modal;
  });


  // Triggered in the login modal to close it
  $scope.closeModal = function() {
    $scope.modal.hide();
    if($scope.addLocationModal){
      $scope.addLocationModal.hide();
    }
  };


  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  //open any modal by id
 /* $scope.openModal = function(index){
    if(index == 1) $scope.modal.show();
    else $scope.addLocationModal.show();

  };*/

  $scope.addLocation = function(){
      $scope.addLocationModal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };



})
.controller('GetLocationCtrl', function($scope, $http){
  $scope.locationInfo = {};
  $scope.searchInfo = {};



  $scope.findZip = function(){
    var owmUrl = "http://api.openweathermap.org/data/2.5/forecast";
    $http({
      method:'GET',
      url: owmUrl,
      params: {zip:$scope.searchInfo.zip}
    }).then(function(response){
      $scope.locationInfo = response.data;
    }, function(){
      alert('no go');
    });

  };


/*  $http.get(owmUrl,{params:{'zip': $scope.searchInfo.zip}})
  .success(function(data){
    $scope.locationInfo = data; 
  });
*/
})


.controller('forecastViewCtrl', function($scope){
  $scope.locations = [
    { id:1, zip:'84663' },
    { id:2, zip:'91775' },
    { id:3, zip:'84606' }

  ];

})


.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
});
