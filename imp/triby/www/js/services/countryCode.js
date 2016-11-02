'use strict';

MyApp.service('CountryCodeService',['ConfigService',
                                    '$http',
                                    '$timeout',
                                    '$cordovaGeolocation',
                                    '$q',
                                    '_',
  function (ConfigService, $http, $timeout, $cordovaGeolocation, $q, _) {
    var _locale,
        _countryCode,
        _coords,
        /**
         * altSpellings property - list of alternative country name
         */
        _countryObject;


    var CountryCodeService = {
      countryCode: [
        {key: 'United States', value: '+1', selected: true},
        {key: 'Afghanistan', value: '+93'},
        {key: 'Aland Islands', value: '+358'},
        {key: 'Albania', value: '+355'},
        {key: 'Algeria', value: '+213'},
        {key: 'American Samoa', value: '+1'},
        {key: 'Andorra', value: '+376'},
        {key: 'Angola', value: '+244'},
        {key: 'Anguilla', value: '+1'},
        {key: 'Antarctica', value: '+672'},
        {key: 'Antigua and Barbuda', value: '+1'},
        {key: 'Argentina', value: '+54'},
        {key: 'Armenia', value: '+374'},
        {key: 'Aruba', value: '+297'},
        {key: 'Ascension Island', value: '+247'},
        {key: 'Australia', value: '+61'},
        {key: 'Austria', value: '+43'},
        {key: 'Azerbaijan', value: '+994'},
        {key: 'Bahamas', value: '+1'},
        {key: 'Bahrain', value: '+973'},
        {key: 'Bangladesh', value: '+880'},
        {key: 'Barbados', value: '+1'},
        {key: 'Belarus', value: '+375'},
        {key: 'Belgium', value: '+32'},
        {key: 'Belize', value: '+501'},
        {key: 'Benin', value: '+229'},
        {key: 'Bermuda', value: '+1'},
        {key: 'Bhutan', value: '+975'},
        {key: 'Bolivia', value: '+591'},
        {key: 'Bosnia and Herzegovina', value: '+387'},
        {key: 'Botswan', value: '+267'},
        {key: 'Brazil', value: '+55'},
        {key: 'British Indian Ocean Territory', value: '+246'},
        {key: 'Brunei Darussalam', value: '+673'},
        {key: 'Burkina Faso', value: '+226'},
        {key: 'Burundi', value: '+257'},
        {key: 'CÃ´te D\'Ivoire', value: '+225'},
        {key: 'Cambodia', value: '+855'},
        {key: 'Cameroon', value: '+237'},
        {key: 'Canada', value: '+1'},
        {key: 'Canary Islands', value: '+34'},
        {key: 'Cape Verde', value: '+238'},
        {key: 'Cayman Islands', value: '+1'},
        {key: 'Central African Republic', value: '+236'},
        {key: 'Ceuta and Melilla', value: '+34'},
        {key: 'Chad', value: '+235'},
        {key: 'Chile', value: '+56'},
        {key: 'China', value: '+86'},
        {key: 'Christmas Island', value: '+61'},
        {key: 'Cocos (Keeling) Island', value: '+61'},
        {key: 'Colombia', value: '+57'},
        {key: 'Comoros', value: '+269'},
        {key: 'Congo', value: '+242'},
        {key: 'Congo- Democratic Republic of the', value: '+243'},
        {key: 'Cook Islands', value: '+682'},
        {key: 'Costa Rica', value: '+506'},
        {key: 'Croatia', value: '+385'},
        {key: 'Cuba', value: '+53'},
        {key: 'Cyprus- Republic of', value: '+357'},
        {key: 'Cyprus- Turkish Republic of Northern', value: '+90'},
        {key: 'Czech Republic', value: '+420'},
        {key: 'Denmar', value: '+45'},
        {key: 'Djibouti', value: '+253'},
        {key: 'Dominica', value: '+1'},
        {key: 'Dominican Republic', value: '+1'},
        {key: 'Ecuador', value: '+593'},
        {key: 'Egypt', value: '+20'},
        {key: 'El Salvador', value: '+503'},
        {key: 'Equatorial Guinea', value: '+240'},
        {key: 'Eritrea', value: '+291'},
        {key: 'Estonia', value: '+372'},
        {key: 'Ethiopia', value: '+251'},
        {key: 'Falkland Islands', value: '+500'},
        {key: 'Faroe Islands', value: '+298'},
        {key: 'Fiji', value: '+679'},
        {key: 'Finland', value: '+358'},
        {key: 'France', value: '+33'},
        {key: 'French Guiana', value: '+594'},
        {key: 'French Polynesia', value: '+689'},
        {key: 'French Southern and Antarctic Lands', value: '+262'},
        {key: 'Gabon', value: '+241'},
        {key: 'Gambia', value: '+220'},
        {key: 'Georgia', value: '+995'},
        {key: 'Germany', value: '+49'},
        {key: 'Ghana', value: '+233'},
        {key: 'Gibraltar', value: '+350'},
        {key: 'Greece', value: '+30'},
        {key: 'Greenland', value: '+299'},
        {key: 'Grenada', value: '+1'},
        {key: 'Guadeloupe', value: '+590'},
        {key: 'Guam', value: '+1'},
        {key: 'Guatemala', value: '+502'},
        {key: 'Guernsey', value: '+44'},
        {key: 'Guinea', value: '+224'},
        {key: 'Guinea-Bissau', value: '+245'},
        {key: 'Guyana', value: '+592'},
        {key: 'Haiti', value: '+509'},
        {key: 'Holy See (Vatican City State)', value: '+39'},
        {key: 'Honduras', value: '+504'},
        {key: 'Hong Kong', value: '+852'},
        {key: 'Hungary', value: '+36'},
        {key: 'Iceland', value: '+354'},
        {key: 'India', value: '+91'},
        {key: 'Indonesia', value: '+62'},
        {key: 'Iran', value: '+98'},
        {key: 'Iraq', value: '+964'},
        {key: 'Ireland', value: '+353'},
        {key: 'Isle of Man', value: '+44'},
        {key: 'Israel', value: '+972'},
        {key: 'Italy', value: '+39'},
        {key: 'Jamaica', value: '+1'},
        {key: 'Japan', value: '+81'},
        {key: 'Jersey', value: '+44'},
        {key: 'Jordan', value: '+962'},
        {key: 'Kazakhstan', value: '+7'},
        {key: 'Kenya', value: '+254'},
        {key: 'Kiribati', value: '+686'},
        {key: 'Korea- Democratic People\'s Republic of', value: '+850'},
        {key: 'Korea- Republic of', value: '+82'},
        {key: 'Kuwait', value: '+965'},
        {key: 'Kyrgyz Republic', value: '+996'},
        {key: 'Laos', value: '+856'},
        {key: 'Latvia', value: '+371'},
        {key: 'Lebanon', value: '+961'},
        {key: 'Lesotho', value: '+266'},
        {key: 'Liberia', value: '+231'},
        {key: 'Libya', value: '+218'},
        {key: 'Liechtenstein', value: '+423'},
        {key: 'Lithuania', value: '+370'},
        {key: 'Luxembourg', value: '+352'},
        {key: 'Macao', value: '+853'},
        {key: 'Macedonia', value: '+389'},
        {key: 'Madagascar', value: '+261'},
        {key: 'Malawi', value: '+265'},
        {key: 'Malaysia', value: '+60'},
        {key: 'Maldives', value: '+960'},
        {key: 'Mali', value: '+223'},
        {key: 'Malta', value: '+356'},
        {key: 'Marshall Islands', value: '+692'},
        {key: 'Martinique', value: '+596'},
        {key: 'Mauritania', value: '+222'},
        {key: 'Mauritius', value: '++230'},
        {key: 'Mayotte', value: '+269'},
        {key: 'Mexico', value: '+52'},
        {key: 'Micronesia', value: '+691'},
        {key: 'Moldova', value: '+373'},
        {key: 'Monaco', value: '+377'},
        {key: 'Mongolia', value: '+976'},
        {key: 'Montenegro', value: '+382'},
        {key: 'Montserrat', value: '+1'},
        {key: 'Morocco', value: '+212'},
        {key: 'Mozambique', value: '+258'},
        {key: 'Myanmar', value: '+95'},
        {key: 'Namibia', value: '+264'},
        {key: 'Nauru', value: '+674'},
        {key: 'Nepal', value: '+677'},
        {key: 'Netherlands', value: '+31'},
        {key: 'Netherlands Antilles', value: '+599'},
        {key: 'New Caledonia', value: '+687'},
        {key: 'New Zealand', value: '+64'},
        {key: 'Nicaragua', value: '+505'},
        {key: 'Niger', value: '+227'},
        {key: 'Nigeria', value: '+234'},
        {key: 'Niue', value: '+683'},
        {key: 'Norfolk Island', value: '+672'},
        {key: 'Northern Mariana Islands', value: '+1'},
        {key: 'Norway', value: '+47'},
        {key: 'Oman', value: '+968'},
        {key: 'Pakistan', value: '+92'},
        {key: 'Palau', value: '+680'},
        {key: 'Palestine', value: '+970'},
        {key: 'Panama', value: '+507'},
        {key: 'Papua New Guinea', value: '+675'},
        {key: 'Paraguay', value: '+595'},
        {key: 'Peru', value: '+51'},
        {key: 'Philippines', value: '+63'},
        {key: 'Pitcairn', value: '+872'},
        {key: 'Poland', value: '+48'},
        {key: 'Portugal', value: '+351'},
        {key: 'Puerto Rico', value: '+1'},
        {key: 'Qatar', value: '+974'},
        {key: 'RÃ©union', value: '+262'},
        {key: 'Romania', value: '+40'},
        {key: 'Russian Federation', value: '+7'},
        {key: 'Rwanda', value: '+250'},
        {key: 'SÃ£o Tome and Principe', value: '+239'},
        {key: 'Saint Helena', value: '+290'},
        {key: 'Saint Kitts and Nevis', value: '+1'},
        {key: 'Saint Lucia', value: '+1'},
        {key: 'Saint Pierre and Miquelon', value: '+508'},
        {key: 'Saint Vincent and the Grenadines', value: '+1'},
        {key: 'Samoa', value: '+685'},
        {key: 'San Marino', value: '+378'},
        {key: 'Saudi Arabia', value: '+966'},
        {key: 'Senegal', value: '+221'},
        {key: 'Serbia', value: '+381'},
        {key: 'Seychelles', value: '+248'},
        {key: 'Sierra Leone', value: '+232'},
        {key: 'Singapor', value: '+65'},
        {key: 'Slovakia', value: '+421'},
        {key: 'Slovenia', value: '+386'},
        {key: 'Solomon Islands', value: '+677'},
        {key: 'Somalia', value: '+252'},
        {key: 'Somaliland', value: '+252'},
        {key: 'South Africa', value: '+27'},
        {key: 'Spain', value: '+34'},
        {key: 'Sri Lanka', value: '+94'},
        {key: 'Sudan', value: '+249'},
        {key: 'Suriname', value: '+597'},
        {key: 'Svalbard and Jan Mayen', value: '+47'},
        {key: 'Swaziland', value: '+268'},
        {key: 'Sweden', value: '+46'},
        {key: 'Switzerland', value: '+41'},
        {key: 'Syria', value: '+Syria'},
        {key: 'Taiwan', value: '+886'},
        {key: 'Tajikistan', value: '+992'},
        {key: 'Tanzania', value: '+255'},
        {key: 'Thailand', value: '+66'},
        {key: 'Timor-Leste', value: '+670'},
        {key: 'Togo', value: '+228'},
        {key: 'Tokelau', value: '+690'},
        {key: 'Tonga', value: '+676'},
        {key: 'Trinidad and Tobago', value: '+1'},
        {key: 'Tristan da Cunha', value: '+290'},
        {key: 'Tunisia', value: '+216'},
        {key: 'Turkey', value: '+90'},
        {key: 'Turkmenistan', value: '+993'},
        {key: 'Turks and Caicos Islands', value: '+1'},
        {key: 'Tuvalu', value: '+688'},
        {key: 'Uganda', value: '+256'},
        {key: 'Ukraine', value: '+380'},
        {key: 'United Arab Emirates', value: '+971'},
        {key: 'United Kingdom', value: '+44'},
        {key: 'United States Minor Outlying Islands', value: '+699'},
        {key: 'Uruguay', value: '+598'},
        {key: 'Uzbekistan', value: '+998'},
        {key: 'Vanuatu', value: '+678'},
        {key: 'Venezuela', value: '+58'},
        {key: 'Viet Nam', value: '+84'},
        {key: 'Virgin Islands- British', value: '+1'},
        {key: 'Virgin Islands- U.S.', value: '+1'},
        {key: 'Wallis and Futuna Islands', value: '+681'},
        {key: 'Western Sahara', value: '+212'},
        {key: 'Yemen', value: '+967'},
        {key: 'Zambia', value: '+260'},
        {key: 'Zimbabwe', value: '+263'}
      ]
    };

    function _getDeviceCountryCode() {
      var deferred = $q.defer();

      var callbacks = {
        geolocation: function(callback) {

          _getCurrentPosition().then(function() {
            _getCountryNameByCoords().then(function(countryObject) {

              _getCurrentCountryCode(function(response) {
                if (response.status === 'success') {
                  return callback(null, {
                    status: 'success',
                    countryCode: response.currentCountryCode
                  })
                }

                callback(null, {status: 'error'});
              }, countryObject.countryName);

            }).catch(function(err) {
              callback(null, {status: 'error'});
            })
          }).catch(function() {
              callback(null, {status: 'error'});
          });
        },
        globalization: function(callback) {
          _getCurrentLocaleObject().then(function() {
            _getCurrentCountryCode(function(data) {
              if (_.isEqual(data.status, 'success')) {
                return callback(null, {
                  status: 'success',
                  countryCode: data.currentCountryCode
                })
              }
              callback(null, {
                status: 'error'
              });
            });
          });
        }
      };

      async.parallel(callbacks, function(err, data) {
        var countryCode;

        _.every(_.keys(callbacks), function(key) {

          if (data[key].status === 'success') {
            countryCode = data[key].countryCode;
            return false;
          }

          return true;
        });

        if (countryCode) {
          deferred.resolve(countryCode);
        } else {
          deferred.reject(data);
        }
      });

      return deferred.promise;
    }

    function _getCountryCode(){
      return CountryCodeService.countryCode;
    };

    function _getCountryName(code){
      for(var i = 0; i < this.countryCode.length; i++){
        if(this.countryCode[i].value == code){
          return this.countryCode[i].key;
        }
      }
    };

    function _getCurrentLocaleName(callback) {
      var parts,
        successCallback = function(response) {
          _locale      = response.value;
          parts        = _locale.split('-');
          _countryCode = parts[1].toLowerCase();

          if (_.isFunction(callback)) {
            callback();
          }
        };

      navigator.globalization.getLocaleName(successCallback);
    }

    function _getCurrentPosition() {
      var deferred = $q.defer();

      $cordovaGeolocation.getCurrentPosition(ConfigService.geolocationOptions).then(function(position) {
        _coords = position.coords;
        deferred.resolve(position);
      }).catch(function(err) {
        deferred.reject(err);
      });

      return deferred.promise;
    }

    function _getCountryNameByCoords(coords) {
      var deferred = $q.defer();

      coords = coords || _coords;

      if (!coords) {
        $timeout(function() {
          deferred.reject('Coords are empty');
        });
        return deferred.promise;
      }

      $http.get(ConfigService.geoNamesUrl, {
        params: {
          lat: coords.latitude,
          lng: coords.longitude,
          username: ConfigService.geoNamesUserName
        }
      }).then(function(data) {
        /**
         * Resolve with geo data.
         */
        deferred.resolve(data.data.geonames[0]);
      }).catch(function(err) {
        deferred.reject(err);
      });

      return deferred.promise;
    }

    function _getCurrentLocaleObject() {
      var deferred = $q.defer(),
        callback = function () {
          $http.get(ConfigService.countryRemoteServiceUrl + _countryCode).success(function(response) {
            _countryObject = response;
            deferred.resolve(_countryObject);
          }).error(function(err) {
            deferred.reject(err);
          });
        }

      if (!_locale) {
        _getCurrentLocaleName(callback);
      } else {
        callback();
      }

      return deferred.promise;
    }

    function _getCurrentCountryCode(callback, name) {
      var searchItem;

      if (!_.isObject(_countryObject) && _.isUndefined(name)) {
        callback({ status: 'error', message: 'Country object is undefined' });
      }

      name = name || _countryObject.name;

      _.every(_getCountryCode(), function(item) {
        if (_.isEqual(name, item.key)) {
          searchItem = item;
          return false;
        } else if (_.isObject(_countryObject) && !_.isUndefined(_countryObject.altSpellings) && _.indexOf(_countryObject.altSpellings, item.key) !== -1) {
          searchItem = item;
          return false;
        }
        return true;
      });

      if (searchItem) {
        callback({ status: 'success', currentCountryCode: searchItem.value });
      } else {
        callback({ status: 'error', message: 'Country code is not found' });
      }
    }

    function _isInternationalNumber(mobileNumber) {
      var found = false,
        index;

      _.each(_getCountryCode(), function(item) {
        index = mobileNumber.indexOf(item.value);
        if (item.value.length && _.isEqual(index, 0)) {
          found = true;
        }
      });

      return found;
    }

    _.extend(CountryCodeService, {
      getCountryName: _getCountryName,
      getCountryCode: _getCountryCode,
      getCurrentLocaleName: _getCurrentLocaleName,
      getCurrentLocaleObject: _getCurrentLocaleObject,
      getCurrentCountryCode: _getCurrentCountryCode,
      isInternationalNumber: _isInternationalNumber,
      getCurrentPosition: _getCurrentPosition,
      getCountryNameByCoords: _getCountryNameByCoords,
      getDeviceCountryCode: _getDeviceCountryCode
    });

    return CountryCodeService;

}]);
