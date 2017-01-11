//factory Service to extract all festive Events and also there details
(function() {
  'use strict';
  angular.module('FestiveEventsApp').
  factory('FestiveEventsService', function($http) {
    const eventsListURL = "http://citysdk.dmci.hva.nl/CitySDK/events/search?category=festival"; //url to fetch all festive event 
    //for Amterdam city ,Netherlands
    var eventDetailsURL = "http://citysdk.dmci.hva.nl/CitySDK/pois/"; ////url to fetch specific Point of Interest information
    const stTimeStampLabel = "DTSTART"; // label for icalendar format parsing
    const endTimeStampLabel = "DTEND"; //label for icalendar format parsing
    const label = "LABEL"; //label for vcard format parsing
    const tsLength = 15; //length of the timestamp literal
    var eventObj = {};
    var mappedEvents = [];


    //helper methods

    //fetch starting index of the label
    function getStartIndex(value, label) {
      return (value.indexOf(label) + label.length + 1);
    }
    
    //format time stamp to DD/MM/YYYY HH:MM
    function formatTS(timeStamp) {
      var ts = timeStamp;
      var dt = ts.slice(6, 8);
      var mt = ts.slice(4, 6);
      var yr = ts.slice(0, 4);
      var date = dt + '/' + mt + '/' + yr;
      var time = ts.slice(9, 11) + "." + ts.slice(11, 13);

      return date + " " + time;
    }

    //parse start and end time stamp from the icalendar format
    function parseTime(time) {
      var stTS = time.substr(
        getStartIndex(time, stTimeStampLabel),
        tsLength);
      var endTS = time.substr(getStartIndex(time, endTimeStampLabel),
        tsLength);

      return {
        stTimeStamp: formatTS(stTS),
        endTimeStamp: formatTS(endTS)
      };

    }

    //parse the vcard information and extract appropriate address
    function getAddress(address) {
      var value = address.substr(getStartIndex(address, label));
      var fullAddress = value.split(':');
      return fullAddress[0];
    }


    //service method to read all festive events from citySdk for Amsterdam city
    var getAllFestiveEvents = function() {
      return $http.get(eventsListURL).then(function(response) {
        var events = response.data.event;
        //map event obj to extract necessary data
        for (var index = 0; index < events.length; index++) {
          eventObj = {
            point: events[index].location.point[0].Point,
            targetPOI: events[index].location.relationship[0].targetPOI,
            label: events[index].label[0],
            time: parseTime(events[index].time[0].value)
          };
          mappedEvents.push(eventObj);
        }
        return mappedEvents;
      });
    };

    //service method to read Point of Interest information for given poi id
    var getDetailsForEvent = function(poi) {
      var url = eventDetailsURL + poi;
      return $http.get(url).then(function(response) {
        const address = response.data.location.address.value;
        const desc = response.data.description[0].value;
        const placeName = response.data.label[0].value;

        return {
          address: getAddress(address),
          description: desc,
          placeName: placeName
        };
      });
    };


    return {
      $getAllFestiveEvents: getAllFestiveEvents,
      $getDetailsForEvent: getDetailsForEvent
    };
  });
}());