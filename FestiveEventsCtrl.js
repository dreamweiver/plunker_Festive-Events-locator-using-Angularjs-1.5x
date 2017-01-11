//Controller to List down all the festive events 
(function() {
  'use strict';
angular.module('FestiveEventsApp')
  .controller('FestiveEventsCtrl', ['$scope', 'FestiveEventsService', function($scope, FestiveEventsService) {
    //models
    $scope.openMenu = true; //model used for toggling side-menu
    $scope.eventList = []; //array model containing all events
    $scope.eventDescription = 'Amsterdam Festive Events'; //default location descption



    //on load of app all festival events happening in  Amsterdam  are fetched and populate to eventList
    FestiveEventsService.$getAllFestiveEvents()
      .then(function(response) {
        for (var index = 0; index < response.length; index++) {
          $scope.eventList.push(response[index]); //populate eventList on the view
        }
      });

    //Callback Handlers 
    //toggle show/hide menu
    $scope.toggleMenu = function() {
      $scope.openMenu = !$scope.openMenu;
    };

    //click handler to navigate the to new location defined by coordinates on google map
    $scope.mapCoordinates = function(posList, poi, label) {

      //on selection of event, call festive event service to fetch POI information
      FestiveEventsService.$getDetailsForEvent(poi)
        .then(function(response) {
          $scope.openMenu = false;
          const latlong = posList.split(" ");
          $scope.eventDescription = response.description;

          //construted coordinates objectfor selected event to locate on map
          $scope.coordinates = {
            lat: latlong[0],
            long: latlong[1],
            title: label,
            placeName: response.placeName
          };
        });
    };
  }]);
}());