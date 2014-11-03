var defaultSites = [
    'facebook.com',
    'netflix.com',
    'hulu.com',
    'pinterest.com',
    'zillow.com',
    'reddit.com',
    'imgur.com',
    'youtube.com',
    'twitter.com',
    'instagram.com',
    'tumblr.com'
];

$(function() {

    $('#sites-to-block').magicSuggest({
        data: defaultSites,
        allowFreeEntries: true,
        useTabKey:true,
        selectFirst: true,
        value: ['www.facebook.com','www.netflix.com'],
        vregex: /[a-z0-9_\-\.]+\.[a-z]{2,3}/
    });

    $( "#datepicker" ).datepicker({
      dateFormat: "yy-mm-dd",
      inline: true
    });

    $('#submit-blocks').click(function(){
        $('#submit-blocks').button('loading');
        $.post( "/lock", {
            block_sites: $('#sites-to-block').magicSuggest().getValue(),
            until_date: $('#datepicker').val()
        })
        .done(function(data){
            alert(data);
        })
        .fail(function(data){
            alert(data);
        })
        .always(function(){
            $('#submit-blocks').button('reset');
        });
    });
});