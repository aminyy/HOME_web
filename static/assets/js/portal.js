$(function () {
    $("[data-load]").each(function () {
        var path = $(this).attr('data-load');
        $(this).load(path);

    });
});


function close_login_required_notify() {
    $('body > .login-required-notify-wrapper').hide();
}

function close_success_notify() {
    $('body > .success-notify-wrapper').hide();
}

function close_error_notify() {
    $('body > .error-notify-wrapper').hide();
}

function QueryStringToJSON() {
    var pairs = location.search.slice(1).split('&');

    var result = {};
    pairs.forEach(function (pair) {
        pair = pair.split('=');
        result[pair[0]] = decodeURIComponent(pair[1] || '');
    });

    return JSON.parse(JSON.stringify(result));
}

function getChangedUrl(pn, v) {
    var queryParameters = {}, queryString = location.search.substring(1),
        re = /([^&=]+)=([^&]*)/g, m;
    while (m = re.exec(queryString)) {
        queryParameters[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
    }
    queryParameters[pn] = v;
    return location.pathname + "?" + $.param(queryParameters);
}

 function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;
    console.log('sURLVariables:', sURLVariables)
    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
}