// Constants

app.constant('HOURS_OF_DAY', [
  {id: 0, name: '12am', zone:'zone4'},
  {id: 1, name: '1am', zone:'zone4'},
  {id: 2, name: '2am', zone:'zone4'},
  {id: 3, name: '3am', zone:'zone1'},
  {id: 4, name: '4am', zone:'zone1'},
  {id: 5, name: '5am', zone:'zone1'},
  {id: 6, name: '6am', zone:'zone1'},
  {id: 7, name: '7am', zone:'zone1'},
  {id: 8, name: '8am', zone:'zone1'},
  {id: 9, name: '9am', zone:'zone1'},
  {id: 10, name: '10am', zone:'zone2'},
  {id: 11, name: '11am', zone:'zone2'},
  {id: 12, name: '12pm', zone:'zone2'},
  {id: 13, name: '1pm', zone:'zone2'},
  {id: 14, name: '2pm', zone:'zone2'},
  {id: 15, name: '3pm', zone:'zone2'},
  {id: 16, name: '4pm', zone:'zone3'},
  {id: 17, name: '5pm', zone:'zone3'},
  {id: 18, name: '6pm', zone:'zone3'},
  {id: 19, name: '7pm', zone:'zone3'},
  {id: 20, name: '8pm', zone:'zone3'},
  {id: 21, name: '9pm', zone:'zone4'},
  {id: 22, name: '10pm', zone:'zone4'},
  {id: 23, name: '11pm', zone:'zone4'},
  {id: 24, name: '12am', zone:'zone4'}
]);

app.constant('DAYS_OF_WEEK', [
  {id: 1, name: 'Mon', longName: 'Monday'},
  {id: 2, name: 'Tue', longName: 'Tuesday'},
  {id: 3, name: 'Wed', longName: 'Wednesday'},
  {id: 4, name: 'Thu', longName: 'Thursday'},
  {id: 5, name: 'Fri', longName: 'Friday'},
  {id: 6, name: 'Sat', longName: 'Saturday'},
  {id: 7, name: 'Sun', longName: 'Sunday'},
  {id: 100, name: 'Public Holidays', longName: 'Public Holidays'}
]);

app.constant('CREDIT_CARD_MONTHS', [
  {id: '01', name: '01 - January'},
  {id: '02', name: '02 - February'},
  {id: '03', name: '03 - March'},
  {id: '04', name: '04 - April'},
  {id: '05', name: '05 - May'},
  {id: '06', name: '06 - June'},
  {id: '07', name: '07 - July'},
  {id: '08', name: '08 - August'},
  {id: '09', name: '09 - September'},
  {id: '10', name: '10 - October'},
  {id: '11', name: '11 - November'},
  {id: '12', name: '12 - December'}
]);

app.constant('GOOGLE_MAP_STYLES', [
  {"elementType": "labels.text", "stylers": [
    {"visibility": "off"}
  ]},
  {"featureType": "landscape.natural", "elementType": "geometry.fill", "stylers": [
    {"color": "#f5f5f2"},
    {"visibility": "simplified"}
  ]},
  {"featureType": "administrative", "stylers": [
    {"visibility": "off"}
  ]},
  {"featureType": "transit", "stylers": [
    {"visibility": "off"}
  ]},
  {"featureType": "poi.attraction", "stylers": [
    {"visibility": "off"}
  ]},
  {"featureType": "landscape.man_made", "elementType": "geometry.fill", "stylers": [
    {"color": "#ffffff"},
    {"visibility": "simplified"}
  ]},
  {"featureType": "poi.business", "stylers": [
    {"visibility": "off"}
  ]},
  {"featureType": "poi.medical", "stylers": [
    {"visibility": "off"}
  ]},
  {"featureType": "poi.place_of_worship", "stylers": [
    {"visibility": "off"}
  ]},
  {"featureType": "poi.school", "stylers": [
    {"visibility": "off"}
  ]},
  {"featureType": "poi.sports_complex", "stylers": [
    {"visibility": "off"}
  ]},
  {"featureType": "road.highway", "elementType": "geometry", "stylers": [
    {"color": "#ffffff"},
    {"visibility": "simplified"}
  ]},
  {"featureType": "road.arterial", "stylers": [
    {"color": "#ffffff"},
    {"visibility": "simplified"}
  ]},
  {"featureType": "road.highway", "elementType": "labels.icon", "stylers": [
    {"color": "#ffffff"},
    {"visibility": "off"}
  ]},
  {"featureType": "road.highway", "elementType": "labels.icon", "stylers": [
    {"visibility": "off"}
  ]},
  {"featureType": "road.arterial", "stylers": [
    {"color": "#ffffff"}
  ]},
  {"featureType": "road.local", "stylers": [
    {"color": "#ffffff"}
  ]},
  {"featureType": "poi.park", "elementType": "labels.icon", "stylers": [
    {"visibility": "off"}
  ]},
  {"featureType": "poi", "elementType": "labels.icon", "stylers": [
    {"visibility": "off"}
  ]},
  {"featureType": "water", "stylers": [
    {"color": "#71c8d4"}
  ]},
  {"featureType": "landscape", "stylers": [
    {"color": "#e5e8e7"}
  ]},
  {"featureType": "poi.park", "stylers": [
    {"color": "#8ba129"}
  ]},
  {"featureType": "road", "stylers": [
    {"color": "#ffffff"}
  ]},
  {"featureType": "road", elementType:"labels", "stylers": [
    {"color": "#888888"}
  ]},
  {"featureType": "poi.sports_complex", "elementType": "geometry", "stylers": [
    {"color": "#c7c7c7"},
    {"visibility": "off"}
  ]},
  {"featureType": "water", "stylers": [
    {"color": "#a0d3d3"}
  ]},
  {"featureType": "poi.park", "stylers": [
    {"color": "#91b65d"}
  ]},
  {"featureType": "poi.park", "stylers": [
    {"gamma": 1.51}
  ]},
  {"featureType": "road.local", "stylers": [
    {"visibility": "off"}
  ]},
  {"featureType": "road.local", "elementType": "geometry", "stylers": [
    {"visibility": "simplified"}
  ]},
  {"featureType": "poi.government", "elementType": "geometry", "stylers": [
    {"visibility": "off"}
  ]},
  {"featureType": "landscape", "stylers": [
    {"visibility": "off"}
  ]},
  {"featureType": "road", "elementType": "labels", "stylers": [
    {"visibility": "off"}
  ]},
  {"featureType": "road.arterial", "elementType": "geometry", "stylers": [
    {"visibility": "simplified"}
  ]},
  {"featureType": "road.local", "stylers": [
    {"visibility": "simplified"}
  ]},
  {"featureType": "road"},
  {"featureType": "road"},
  {},
  {"featureType": "road.highway"}
]);
