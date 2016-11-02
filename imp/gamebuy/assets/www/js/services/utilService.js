//------------------------------------------------------------
// Util Service
//------------------------------------------------------------
angular.module('util.services', [])

.service('UtilServ', function ($http, $localstorage) {
    this.distance_converter = function (miles) {
        var country = $localstorage.get('me_country');
        // in miles unit
        if (country === "United Kingdom" || country === "United States" ) {
            miles = miles.toFixed(2);
            if (miles == 0.00){
                miles = "within 0.01 mikes";
            }
            else{
                miles = miles + " miles";
            }
        }
        // in KM unit
        else {
            miles = miles * 1.60934;
            miles = miles.toFixed(2);
            if (miles == 0.00){
                miles = "within 0.01 km";
            }
            else{
                miles = miles + " km";
            }
        }
        return miles;
    };

    this.get_error_message = function(error_code) {
        var error_mapping = {
            "InputJsonUnparsable"           : "Input JSON is not parsable", //for logging purpose, not showing to users
            "InvalidInputParameters"        : "Invalid input parameters", //for logging purpose, not showing to users
            "PriceError"                    : "Found negative listing price", // not showing to user ?
            "InvalidCollectAs"              : "Unexpected collect_as value reached to API collection_update", // not showing to user
            "HaveAlreadyHave"               : "Invalid Request: Tried to have a already had game", // not showing to user
            "NoCollectionsIntheDB"          : "Requested collection is not in the database", // not showing to user
            // NearMe
            "NoGeoLocation"                 : "Waiting for your location to be determined.", //
            "NoGamesinApp"                  : "No games are available for sale near you at this time", // no games in the whole app
            "NoGamesInWishlist"             : "Your wish list is empty, start adding wanted games; GBG will find and list the ones for sale here.",
            "NoGamesMatchWishlist"          : "None of the games in your wish list are currently offered for sale. Check out other games! Click on “All Games”.",
            "NoSellersFound"                : "No GBG gamers have sold games near you at this time.", // no top gamers in city
            //Deal and Related Actions
            "NoDealsFound"                  : "You don't currently have any transactions actively underway",
            "NotEnoughCredit"               : "Not enough credit in your GBG wallet",
            "NoWatchesFound"                : "Your watch list is empty",
            //Search
            "NoCodeFound"                   : "No barcode found, need help to input", // not showing to user ?
            "NoSearchResultFound"           : "Sorry, the system doesn't recognize the game you are looking for. We are constantly adding games. Let us know what we are missing by clicking button",
            "NoGamesFoundhave"              : "No GBG gamers near you have yet listed their game collection",
            "NoGamesFoundsell"              : "There are no games currently available for sale near you.",
            "NoGamesFoundbuy"               : "GBG gamers near you haven't yet listed any games they want",
            "NoGamersFoundhave"             : "No GBG gamers near you currently own this game",
            "NoGamersFoundsell"             : "No GBG gamers near you are currently offering this game for sale",
            "NoGamersFoundbuy"              : "Currently no GBG gamers near you have this game in their wish list",
            //Chat
            "NoChatThreadsFound"            : "No active chats. Start chatting with other GBG gamers near you",
            //Me
            "NoCollectionsFoundhave"        : "You haven't listed any games you own",
            "NoCollectionsFoundsell"        : "You haven't listed any games for sale",
            "NoCollectionsFoundbuy"         : "You don't have any games in your wish list",
            "NoFavouritesFound"             : "You haven't added any gamers to favourite list",
            "NoRatesFound"                  : "No ratings so far. Ask anyone you trade with to provide a rating. The higher your rating score is, the more trusted you will be.",
            "NoGamesFoundbought"            : "haven't bought any games yet",
            "NoGamesFoundsold"              : "haven't sold any games yet",
            //other_gamers
            "NoCollectionsFoundhave_others" : "This gamer hasn't listed any owned games",
            "NoCollectionsFoundsell_others" : "This gamer hasn't listed any games for sale",
            "NoCollectionsFoundbuy_others"  : "This gamer hasn't any games in the wish list",
            "NoRatesFound_others"           : "No reviews so far.",
            //Reset Password and Login
            "NoSuchEmail"                   : "This email address is not on our record, please check if there is a typo",
            "EmailUsed"                     : "Email address has already been used",
            "EmailPasswordIncorrect"        : "The email address or password is not correct",
            "send_reset_email_NoErrors"     : "The link to reset password has been emailed to ",
            //question related
            "NoQuestionSetFound"            : "Oops.. the question has been removed.",
            "NoQuestionMapFound"            : "Oops.. the question has been removed.",
            //notification related
            "NoNotificationsFound"          : "No notifications yet"
        };

        if (error_mapping[error_code] !== undefined) {
            return error_mapping[error_code];
        }
        else {
            console.log(error_code + " is missing from the map");
            return "";
        }
    };

    this.time_since = function(date){
        var seconds = Math.floor((new Date() - new Date(date)) / 1000);
        var interval = Math.floor(seconds / 31536000);

        if (interval > 1) {
            return interval + " years ago";
        }
        interval = Math.floor(seconds / 2592000);
        if (interval > 1) {
            return interval + " months ago";
        }
        interval = Math.floor(seconds / 86400);
        if (interval > 1) {
            return interval + " days ago";
        }
        interval = Math.floor(seconds / 3600);
        if (interval > 1) {
            return interval + " hours ago";
        }
        interval = Math.floor(seconds / 60);
        if (interval > 1) {
            return interval + " minutes ago";
        }
        return "just now";
    };

    this.get_deal_status_message = function(deal_status){
        var mapping = {
            "buyer_cancel"      : "Buyer cancelled",
            "seller_cancel"     : "Seller cancelled",
            "request"           : "Offer placed",
            "buyer_withdraw"    : "Buyer withdrew",
            "seller_reject"     : "Seller rejected",
            "accept"            : "Offer accepted",
            "receive"           : "Completed"
        };

        if (mapping[deal_status] !== undefined) {
            return mapping[deal_status];
        }
        else {
            console.log(deal_status + " is missing from the map");
            return "";
        }
    };

    this.get_deal_status_history_message = function(deal_status, deal_price, price_unit, use_credit){
        var mapping_use_credit = {
            "buyer_cancel"      : "Buyer cancelled, and " + deal_price + " " + price_unit + " have been unfrozen in buyer's wallet",
            "seller_cancel"     : "Seller cancelled, and " + deal_price + " " + price_unit + " have been unfrozen in buyer's wallet",
            "request"           : "Offer placed, and " + deal_price + " " + price_unit + " have been frozen in buyer's wallet",
            "buyer_withdraw"    : "Buyer withdrew, and " + deal_price + " " + price_unit + " have been unfrozen in buyer's wallet",
            "seller_reject"     : "Seller rejected, and " + deal_price + " " + price_unit + " have been unfrozen in buyer's wallet",
            "accept"            : "Offer accepted",
            "receive"           : "Completed, and money have been transferred from buyer's wallet to seller's wallet"
        };

        var mapping_use_cash = {
            "buyer_cancel"      : "Buyer cancelled",
            "seller_cancel"     : "Seller cancelled",
            "request"           : "Offer placed",
            "buyer_withdraw"    : "Buyer withdrew",
            "seller_reject"     : "Seller rejected",
            "accept"            : "Offer accepted",
            "receive"           : "Completed"
        };

        if (use_credit && mapping_use_credit[deal_status] !== undefined) {
            return mapping_use_credit[deal_status];
        }
        else if (!use_credit && mapping_use_cash[deal_status] !== undefined) {
            return mapping_use_cash[deal_status];
        }
        else {
            console.log(deal_status + " is missing from the map");
            return "";
        }
    };

    this.get_collect_as_message = function(collect_as){
        var mapping = {
            "hide"  : "Offer accepted",
            "have"  : "owned",
            "sell"  : "for sale",
            "buy"   : "in wishlist"
        };

        if (mapping[collect_as] !== undefined) {
            return mapping[collect_as];
        }
        else {
            console.log(collect_as + " is missing from the map");
            return "";
        }
    };

    this.get_deal_unaction_display_message = function (deal_key_name){
        var mapping = {
            "buyer_request" : "Waiting for seller's response",
            "seller_accept" : "Waiting for buyer's response",
            "delete"        : "Trade has been cancelled",
            "delete_rate"   : "Rate has been submitted",
            "close"         : "Close"
        };

        if (mapping[deal_key_name] !== undefined) {
            return mapping[deal_key_name];
        }
        else {
            console.log(deal_key_name + " is missing from the map");
            return "";
        }
    };

    this.get_collect_format_message = function (collect_format){
        var mapping = {
            null           : "",
            "disc"         : "Disc",
            "digital_code" : "Digital code",
            "console"      : "Console",
            "game_account" : "Game account"
        };

        if (mapping[collect_format] !== undefined) {
            return mapping[collect_format];
        }
        else {
            console.log(collect_format + " is missing from the map");
            return "";
        }
    };

    this.get_collect_format_value = function (collect_format){
        var mapping = {
            null           : -1,
            "disc"         : 0,
            "digital_code" : 1,
            "console"      : 2,
            "game_account" : 3
        };

        if (mapping[collect_format] !== undefined) {
            return mapping[collect_format];
        }
        else {
            console.log(collect_format + " is missing from the map");
            return "";
        }
    };
})

.service('$localstorage', function ($window) {

    this.get = function (key, defaultValue) {
        stored_value = $window.localStorage[key];
        if (stored_value == undefined || stored_value == 'undefined')
            return defaultValue;
        else
            return $window.localStorage[key];
    };

    this.set = function (key, value) {
        $window.localStorage[key] = value;
    };

    this.getObject = function (key, defaultValue) { //default value should be '{}' or '[]'
        stored_value = $window.localStorage[key];
        if (stored_value == undefined || stored_value == 'undefined')
            return JSON.parse(defaultValue);
        else
            return JSON.parse(stored_value);
    };

    this.setObject = function (key, value) {
            $window.localStorage[key] = angular.toJson(value);
    };

    this.clear = function(key){
        $window.localStorage.removeItem(key);
    };

    this.clearAll = function(){
        $window.localStorage.clear();
    };

    this.clearGroup = function(key_prefix){
        for (var key in $window.localStorage){
            if (key.indexOf(key_prefix) === 0)
                $window.localStorage.removeItem(key);
        }
    };
});