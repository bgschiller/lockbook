var defaultSites = [
    'www.facebook.com',
    'www.netflix.com'
];

$(function() {

    $('#sites-to-block').magicSuggest({
        data: defaultSites,
        allowFreeEntries: true,
        useTabKey:true,
        selectFirst: true,
        value: defaultSites,
        vregex:/[a-z0-9_\-\.]+\.[a-z]{2,3}/
    });

    $( "#datepicker" ).datepicker({
      dateFormat: "yy-mm-dd",
      inline: true
    });

});