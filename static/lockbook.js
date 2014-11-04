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
            blocksites: JSON.stringify($('#sites-to-block').magicSuggest().getValue()),
            until_date: $('#datepicker').val()
        })
        .done(function(data){
            console.log("done",data);
            $('#blockSites').modal('hide');
        })
        .fail(function(data){
            console.log("fail",data);
            if ($('#alert-target div.alert').length == 0){
                $('<div class="alert alert-warning alert-dismissible" role="alert"> <button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button> <strong>Uh Oh, something went wrong.</strong>This is all we know: <span class="problem-text"></span></div>')
                .appendTo("#alert-target");
            }
            resp = JSON.parse(data.responseText);
            $('#alert-target .problem-text').html(resp.message);

        })
        .always(function(){
            $('#submit-blocks').button('reset');
        });
    });
});