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

var boot_template = '<div class="alert alert-STATUS alert-dismissible" role="alert"> <button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button> <strong> STRONG </strong> MESSAGE </div>';
function boot_alert(status, strong, message){
    //This guy doesn't work if, eg, strong contains 'MESSAGE' too bad. #wontfix
    return $(boot_template
        .replace('STATUS',status)
        .replace('STRONG',strong)
        .replace('MESSAGE',message));
}
$(function() {
    if( location.search.indexOf('redirected=1') > 0) {
        boot_alert('info','Oh snap!','That page was blocked by your former self.')
            .appendTo('#alert-target');
    } else if ( location.search.indexOf('success=1') > 0){
        boot_alert('success', 'Success!', 'Your lock was saved.')
            .appendTo('#alert-target');
    }

    $('#sites-to-block').magicSuggest({
        data: defaultSites,
        allowFreeEntries: true,
        useTabKey:true,
        selectFirst: true,
        value: ['facebook.com','netflix.com'],
        vregex: /[a-z0-9_\-\.]+\.[a-z]{2,3}/,
        maxSelection:null
    });

    $( "#datepicker" ).datepicker({
      dateFormat: "yy-mm-dd",
      inline: true
    });

    $('#submit-blocks').click(function(){
        $('#submit-blocks').button('loading');
        $.post( "/lock", {
            block_sites: JSON.stringify($('#sites-to-block').magicSuggest().getValue()),
            until_date: $('#datepicker').val()
        })
        .done(function(data){
            location.replace(location.href + '?success=1');
        })
        .fail(function(data){
            console.log("fail",data);
            var resp = JSON.parse(data.responseText);
            if ($('#alert-target div.alert').length == 0){
                boot_alert('warning', 'Uh oh, something went wrong', resp.message)
                    .appendTo("#block-sites-alert-target");
            }
            $('#alert-target .problem-text').html(resp.message);

        })
        .always(function(){
            $('#submit-blocks').button('reset');
        });
    });
});