'use strict';

MyApp.factory('ConfigService', [
  '_',
  function(_) {

    var common = {

      isDebug: false,

      phoneContactsTypePriority: ['mobile', 'iPhone', 'main', 'work', 'home'],

      s3Url: 'http://{0}.s3.amazonaws.com/',

      /**
       * Count for retrive history for chat
       */
      chatHistoryCounter: 100,

      countryRemoteServiceUrl: 'https://restcountries.eu/rest/v1/alpha/',
      /**
       * GeoName Service Data.
       */
      geoNamesUrl: 'http://api.geonames.org/findNearbyPlaceNameJSON',
      geoNamesUserName: 'triby',

      contactFields: ["*"],
      signupPageTimeout: 20,
      chatTimeout: 1,

      geolocationOptions: {
        maximumAge: 0,
        timeout: 3000,
        enableHighAccuracy:true
      },

      /**
       * Crop dimensions
       */
      cropWidth: 200,
      cropHeight: 200,

      /**
       * Available values Dev, Prod
       */
      appMode: 'Prod'
    };

    var prod_001 = {

      googleAnalyticsTrackingCode: 'UA-59951832-2',

      backendUrl: 'http://triby-prod.herokuapp.com',

      pubnubPublishKey: 'pub-c-c85a92cf-d126-4a72-86da-b51d9bbed72e',
      pubnubSubscribeKey: 'sub-c-6ab555a8-379b-11e5-a605-0619f8945a4f',

      pushwooshAppId: 'C0ED8-12836',
      pushwooshGoogleProjectId: '665392610075'
    };

    var prod_110 = {

      googleAnalyticsTrackingCode: 'UA-59951832-2',

      backendUrl: 'http://triby-prod-110.herokuapp.com',

      pubnubPublishKey: 'pub-c-c85a92cf-d126-4a72-86da-b51d9bbed72e',
      pubnubSubscribeKey: 'sub-c-6ab555a8-379b-11e5-a605-0619f8945a4f',

      pushwooshAppId: 'C0ED8-12836',
      pushwooshGoogleProjectId: '665392610075'
    };

    var dev = {

      googleAnalyticsTrackingCode: 'UA-59951832-3',

      backendUrl: 'http://triby-dev.herokuapp.com',

      pubnubPublishKey: 'pub-c-5034644d-22b2-4a49-bc5d-1203975e6339',  //dev pair
      pubnubSubscribeKey: 'sub-c-6e069bd6-379b-11e5-8166-0619f8945a4f',

      pushwooshAppId: 'F3891-626E7',
      pushwooshGoogleProjectId: '29082598172'
    };

    var devAws = {

      googleAnalyticsTrackingCode: 'UA-59951832-3',

      backendUrl: 'http://52.23.176.215:3025',

      pubnubPublishKey: 'pub-c-5034644d-22b2-4a49-bc5d-1203975e6339',  //dev pair
      pubnubSubscribeKey: 'sub-c-6e069bd6-379b-11e5-8166-0619f8945a4f',

      pushwooshAppId: 'F3891-626E7',
      pushwooshGoogleProjectId: '29082598172'
    };

    var prod110Aws = {
      googleAnalyticsTrackingCode: 'UA-59951832-2',

      backendUrl: 'http://52.23.176.215:3000',

      pubnubPublishKey: 'pub-c-c85a92cf-d126-4a72-86da-b51d9bbed72e',
      pubnubSubscribeKey: 'sub-c-6ab555a8-379b-11e5-a605-0619f8945a4f',

      pushwooshAppId: 'C0ED8-12836',
      pushwooshGoogleProjectId: '665392610075'
    };

     var prod110Aws1 = {
      googleAnalyticsTrackingCode: 'UA-59951832-2',

      backendUrl: 'http://52.54.30.219:3000',

      pubnubPublishKey: 'pub-c-c85a92cf-d126-4a72-86da-b51d9bbed72e',
      pubnubSubscribeKey: 'sub-c-6ab555a8-379b-11e5-a605-0619f8945a4f',

      pushwooshAppId: 'C0ED8-12836',
      pushwooshGoogleProjectId: '665392610075'
    };

    var local = {

      isDebug: true,

      googleAnalyticsTrackingCode: 'UA-59951832-4',

      //pubnubPublishKey: 'pub-c-5034644d-22b2-4a49-bc5d-1203975e6339',  //dev pair
      //pubnubSubscribeKey: 'sub-c-6e069bd6-379b-11e5-8166-0619f8945a4f',

      pubnubPublishKey: 'pub-c-d9a5134d-97bf-487c-93c2-baf3c98d3fbb',
      pubnubSubscribeKey: 'sub-c-ae0fd742-379b-11e5-a60c-0619f8945a4f',

      backendUrl: 'http://192.168.88.13:3025',

      //pushwooshAppId: 'F3891-626E7', //dev
      //pushwooshGoogleProjectId: '29082598172'

      pushwooshAppId: '06EC6-CACE3',
      pushwooshGoogleProjectId: '825050779804'
    };

    var localDev = {

      isDebug: true,

      googleAnalyticsTrackingCode: 'UA-59951832-4',

      pubnubPublishKey: 'pub-c-5034644d-22b2-4a49-bc5d-1203975e6339',  //dev pair
      pubnubSubscribeKey: 'sub-c-6e069bd6-379b-11e5-8166-0619f8945a4f',

      backendUrl: 'http://192.168.1.209:3025',

      pushwooshAppId: 'F3891-626E7', //dev
      pushwooshGoogleProjectId: '29082598172'
    };

    //return _.extend(common, prod_001);
    //return _.extend(common, prod_110);
    //return _.extend(common, dev);
//    return _.extend(common, prod110Aws);
    return _.extend(common, prod110Aws1);
    //return _.extend(common, devAws);
    //return _.extend(common, local);
    //return _.extend(common, localDev);

  }
]);
