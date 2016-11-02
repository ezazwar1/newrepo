// Application configuration

if (window.cordova) {
  // Cordova platform

  app.constant('CONFIG', {
    api_version: 2,

    // ** production **
    url: 'https://go.workninja.com/api',
    signup_url: 'https://go.workninja.com/signup',
    forgot_password_url: 'https://go.workninja.com/password/reset',
    terms_and_conditions_url: 'https://go.workninja.com/terms_and_conditions',
    privacy_policy_url: 'https://go.workninja.com/privacy_policy',
    apply_url: 'https://go.workninja.com/apply/',

    // ** staging **
    // url: 'https://staging.workninja.com/api',
    // signup_url: 'https://staging.workninja.com/signup',
    // forgot_password_url: 'https://staging.workninja.com/password/reset',
    // terms_and_conditions_url: 'https://staging.workninja.com/terms_and_conditions',
    // privacy_policy_url: 'https://staging.workninja.com/privacy_policy',
    // apply_url: 'http://workninja.com/become-a-ninja/',

    // ** development **
    // url: 'http://192.168.0.200:3000',
    // signup_url: 'https://192.168.0.200:3000/signup',
    // forgot_password_url: 'https://192.168.0.200:3000/password/reset',
    // terms_and_conditions_url: 'https://192.168.0.200:3000/terms_and_conditions',
    // privacy_policy_url: 'https://192.168.0.200:3000/privacy_policy',

    // PubNub
    publish_key: 'pub-c-38b9c149-1237-44bc-9e14-8258934eeefe',
    subscribe_key: 'sub-c-4c81fbdc-58a7-11e4-9bbe-02ee2ddab7fe',
    secret_key: 'sec-c-MmYyZjRiNWQtZGUyNC00N2JiLTg0OWItNWVkMzRhZDJjOGZh'
  });
}
else {
  // Development

  app.constant('CONFIG', {
    api_version: 2,

    // ** production **
   url: 'https://go.workninja.com/api',
   signup_url: 'https://go.workninja.com/signup',
   forgot_password_url: 'https://go.workninja.com/password/reset',
   terms_and_conditions_url: 'https://go.workninja.com/terms_and_conditions',
   privacy_policy_url: 'https://go.workninja.com/privacy_policy',

    // ** staging **
    // url: 'https://staging.workninja.com/api',
    // signup_url: 'https://staging.workninja.com/signup',
    // forgot_password_url: 'https://staging.workninja.com/password/reset',
    // terms_and_conditions_url: 'https://staging.workninja.com/terms_and_conditions',
    // privacy_policy_url: 'https://staging.workninja.com/privacy_policy',
    // apply_url: 'http://workninja.com/become-a-ninja/',

    // // ** development **
    // url: 'http://192.168.0.200:3000',
    // signup_url: 'https://192.168.0.200:3000/signup',
    // forgot_password_url: 'https://192.168.0.200:3000/password/reset',
    // terms_and_conditions_url: 'https://192.168.0.200:3000/terms_and_conditions',
    // privacy_policy_url: 'https://192.168.0.200:3000/privacy_policy',

    // url: 'http://localhost:8080',

    // PubNub
    publish_key: 'pub-c-38b9c149-1237-44bc-9e14-8258934eeefe',
    subscribe_key: 'sub-c-4c81fbdc-58a7-11e4-9bbe-02ee2ddab7fe',
    secret_key: 'sec-c-MmYyZjRiNWQtZGUyNC00N2JiLTg0OWItNWVkMzRhZDJjOGZh'
  });
}
