var defaultSites = [
    'www.facebook.com',
    'www.netflix.com',
    'www.hulu.com',
    'www.pinterest.com',
    'www.zillow.com',
    'www.reddit.com',
    'imgur.com',
    'www.youtube.com',
    'twitter.com',
    'instagram.com',
    'www.tumblr.com'
];

$(function() {

    $('#sites-to-block').magicSuggest({
        data: defaultSites,
        allowFreeEntries: true,
        useTabKey:true,
        selectFirst: true,
        value: ['www.facebook.com','www.netflix.com'],
        vregex:/[a-z0-9_\-\.]+\.[a-z]{2,3}/
    });

    $( "#datepicker" ).datepicker({
      dateFormat: "yy-mm-dd",
      inline: true
    });

});