MyApp.filter('customDate', function($filter) {
  return function(date) {
    var currentDate, diffDays, filterDate, temp, oneDay;
    oneDay = 24*60*60*1000;
    currentDate = new Date();
    filterDate = new Date(date);
    diffDays = Math.round(Math.abs((currentDate.getTime() - filterDate.getTime())/(oneDay)));
    if(diffDays == 0){
      temp = 'Today';
      temp += $filter('date')(date, " @ h:mma");
      return temp;
    }
    else if(diffDays == 1){
      temp = 'Yesterday';
      temp += $filter('date')(date, " @ h:mma");
      return temp;
    }
    else{
      return $filter('date')(date, "MMM dd, yyyy @ h:mma");
    }
  };
});

MyApp.filter('customShortDate', function($filter) {
  return function(date) {
    var currentDate, diffDays, filterDate, temp, oneDay;
    oneDay = 24*60*60*1000;
    currentDate = new Date();
    filterDate = new Date(date);
    diffDays = Math.round(Math.abs((currentDate.getTime() - filterDate.getTime())/(oneDay)));
    if(diffDays == 0){
      temp = 'Today';
      temp += $filter('date')(date, " @ h:mma");
      return temp;
    }
    else if(diffDays == 1){
      temp = 'Yesterday';
      temp += $filter('date')(date, " @ h:mma");
      return temp;
    }
    else{
      return $filter('date')(date, "MMM dd @ h:mma");
    }
  };
});

MyApp.filter('chatDate', function($filter) {
  return function(date) {

    if (!date) {
      date = new Date().toISOString();
    }

    return $filter('date')(date, "MMM dd, yyyy @ h:mma");
  };
});

MyApp.filter('chatsDate', function($filter) {
  return function(date) {
    var currentDate, diffDays, filterDate, temp, oneDay;
    oneDay = 24*60*60*1000;
    currentDate = new Date();
    filterDate = new Date(date);
    diffDays = Math.round(Math.abs((currentDate.getTime() - filterDate.getTime())/(oneDay)));
    if(diffDays == 0){
      //temp = 'Today';
      //temp += $filter('date')(date, " @ h:mma");
      return $filter('date')(date, "h:mm a");
    }
    else if(diffDays == 1){
      temp = 'Yesterday';
      return temp;
    }
    else{
      return $filter('date')(date, "yyyy/M/d");
    }
  };
});

MyApp.filter('lastMessage', function($filter) {
  return function(string) {
    if(string.length > 24) {
      return string.substring(0, 18) + '...';
    } else {
      return string;
    }
  };
});

// from https://gist.github.com/naoyeye/8220054#file-angular-filters-nl2br-js
MyApp.filter('processHTML', function($sce){
  return function(msg,is_xhtml) {
    var is_xhtml = is_xhtml || true,
      breakTag = (is_xhtml) ? '<br />' : '<br>',
      msgOut = (msg + ''),

    //URLs starting with http://, https://, or ftp://
      replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;

    msgOut = msgOut.replace(replacePattern1, '<a href="#" onclick="window.open(\'$1\', \'_blank\', \'location=no,closebuttoncaption=Close,toolbarposition=top\'); return false;">$1</a>');

    //URLs starting with "www." (without // before it, or it'd re-link the ones done above).
    var replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
    msgOut = msgOut.replace(replacePattern2, '$1<a href="#" onclick="window.open(\'http://$2\', \'_blank\', \'location=no,closebuttoncaption=Close,toolbarposition=top\'); return false;">$2</a>');

    msgOut = msgOut.replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1'+ breakTag +'$2');

    return $sce.trustAsHtml(msgOut);
  }
});

MyApp.filter('startsWith', function() {

  function strStartsWith(str, prefix) {
    return (str.toLowerCase()+"").indexOf(prefix.toLowerCase()) === 0;
  }

  return function( items, name) {
    var filtered = [];

    angular.forEach(items, function(item) {
      if(strStartsWith(item.name, name)){
        filtered.push(item);
      }
    });

    return filtered;
  };
});

MyApp.filter('limitName', function() {

  return function(name) {

    if(!name || !name.length || name.length < 17) {
      return name;
    }

    return name.substr(0,13)+ '...';
  };
});


MyApp.filter('groupName', function($filter) {
  return function(string) {
    if(string && string.length > 7) {
      return string.substring(0, 7) + '...';
    } else {
      return string;
    }
  };
});
