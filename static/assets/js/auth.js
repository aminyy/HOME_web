function HTMLEnCode(str) {
    var s = "";
    if (str.length == 0)    return "";
    s = str.replace(/&/g, "&gt;");
    s = s.replace(/</g, "&lt;");
    s = s.replace(/>/g, "&gt;");
    s = s.replace(/    /g, "&nbsp;");
    s = s.replace(/\'/g, "'");
    s = s.replace(/\"/g, "&quot;");
    s = s.replace(/\n/g, "<br>");
    s = s.replace(/[\s,\,]*/g, "");
    s = s.replace(/s*/g, "");
    return s;
}
function HTMLDeCode(str) {
    var s = "";
    if (str.length == 0)    return "";
    s = str.replace(/&gt;/g, "&");
    s = s.replace(/&lt;/g, "<");
    s = s.replace(/&gt;/g, ">");
    s = s.replace(/&nbsp;/g, "    ");
    s = s.replace(/'/g, "\'");
    s = s.replace(/&quot;/g, "\"");
    s = s.replace(/<br>/g, "\n");
    return s;
}

function removeTr() {
    $(this).closest("tr").remove();
}

$(function () {
    $("[data-load]").filter(":visible").each(function () {
        var path = $(this).attr('data-load');
        $(this).load(path);

    });
});