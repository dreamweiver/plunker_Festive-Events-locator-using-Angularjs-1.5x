//custom isolated directive for rendering google map
(function() {
  'use strict';
  angular.module('FestiveEventsApp')
  .directive('angularGmap', function() {

  //mark the location on map with coordinates and zoom
  function markLatLongOnMap(coordinates, zoom) {
    //map options for constructed for google map
    const mapOptions = {
      zoom: zoom,
      center: new google.maps.LatLng(coordinates.lat, coordinates.long),
      mapTypeId: google.maps.MapTypeId.TERRAIN
    };

    //google map instantiated for element with id "map", with above map options
    const map = new google.maps.Map(document.getElementById('map'), mapOptions);

    //constructing marker object to place on the map
    const marker = new google.maps.Marker({
      map: map,
      position: new google.maps.LatLng(coordinates.lat, coordinates.long),
      title: coordinates.title
    });

    marker.content = '<div>' + coordinates.placeName + '</div>';

    //instantiating information window, which will be displayed on 
    //clicking over the marker
    const infoWindow = new google.maps.InfoWindow();

    //attach click event with event handler to show infoWindow
    google.maps.event.addListener(marker, 'click', function() {
      infoWindow.setContent('<h2>' + marker.title + '</h2>' + marker.content);
      infoWindow.open(map, marker);
    });
  }

  //position the map to specified lat long coordinates
  function link(scope, element, attrs) {
    //initial map location set to amsterdam by default
    const defaultCoordinates = {
      lat: "52.370216",
      long: "4.895168",
      title: "Amsterdam", // title of info window
      placeName: "Amsterdam" //content of inside info window
    };
    const defaultZoom = 5; // zoom value to point Amsterdam on load
    const zoom = 16; // zoom value to point all locations of events
    markLatLongOnMap(defaultCoordinates, defaultZoom);

    //update the marker on map when coordinates change
    scope.$watch('coordinates', function(value) {
      if (!!value) {
        markLatLongOnMap(value, zoom);
      }
    });
  }

  return {
    templateUrl: 'angular-gmap.html',
    scope: {
      coordinates: '='
    },
    restrict: 'E',
    link: link
  };
});
}());
