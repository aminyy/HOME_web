/**
 * Created by paul on 16-6-7.
 */
'use strict';

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


$(function () {
    $("[data-load]").filter(":visible").each(function () {
        var path = $(this).attr('data-load');
        $(this).load(path);

    });

    //by zmc.
    $(".form-validate").validate();
    $(".date-picker").datepicker({
        format: 'yyyy-mm-dd',
        language: "zh-CN"
    });

    //禁用Enter键表单自动提交
    document.onkeydown = function (event) {
        var target, code, tag;
        if (!event) {
            event = window.event; //针对ie浏览器
            target = event.srcElement;
            code = event.keyCode;
            if (code == 13) {
                tag = target.tagName;
                if (tag == "TEXTAREA") {
                    return true;
                }
                else {
                    return false;
                }
            }
        }
        else {
            target = event.target; //针对遵循w3c标准的浏览器，如Firefox
            code = event.keyCode;
            if (code == 13) {
                tag = target.tagName;
                if (tag == "INPUT") {
                    return false;
                }
                else {
                    return true;
                }
            }
        }
    };

});

function removeTr() {
    $(this).closest("tr").remove();
}

// input mask for longtitude and latitude
Inputmask.extendAliases({
    'longtitude': {
        autoUnmask: false,
        mask: "[+][1]9{1,2}°59'59\"",
        definitions: {
            "1": {
                validator: "[0-1]",
                cardinality: 1,
                greddy: false
            },
            "5": {
                validator: "[0-5]",
                cardinality: 1,
                greddy: false
            },
            "+": {
                validator: "[+-]",
                cardinality: 1,
                greddy: false
            },
        }
    },
    'latitude': {
        autoUnmask: false,
        mask: "[+]9{1,2}°59'59\"",
        definitions: {
            "1": {
                validator: "[0-1]",
                cardinality: 1,
                greddy: false
            },
            "5": {
                validator: "[0-5]",
                cardinality: 1,
                greddy: false
            },
            "+": {
                validator: "[+-]",
                cardinality: 1,
                greddy: false
            },
        }
    },
});

//字符串格式化
String.prototype.format = function () {
    var args = arguments;
    return this.replace(/\{(\d+)\}/g,
        function (m, i) {
            return args[i];
        });
}

// jQuery.validator.addMethod("longtitude", function(value,element) {
//   return this.optional(element) ||/^([+-]?(180)|(\s*1[0-7]\d)|(\s*\d{1,2}))°([0-5][0-9])'([0-5][0-9])"$/.test(value);
// }, "不是正确的经度格式");
// jQuery.validator.addMethod("latitude", function(value,element) {
//   return this.optional(element) || /^([+-]?(90)|(\s*[0-8]\d)|(\s*\d))°([0-5][0-9])'([0-5][0-9])"$/.test(value);
// }, "不是正确的纬度格式");
jQuery.extend(jQuery.validator.messages, {
    required: "必选字段",
    remote: "请修正该字段",
    email: "请输入正确格式的电子邮件",
    url: "请输入合法的网址",
    date: "请输入合法的日期",
    dateISO: "请输入合法的日期 (ISO).",
    number: "请输入合法的数字",
    digits: "只能输入整数",
    creditcard: "请输入合法的信用卡号",
    equalTo: "请再次输入相同的值",
    accept: "请输入拥有合法后缀名的字符串",
    maxlength: jQuery.validator.format("请输入一个长度最多是 {0} 的字符串"),
    minlength: jQuery.validator.format("请输入一个长度最少是 {0} 的字符串"),
    rangelength: jQuery.validator.format("请输入一个长度介于 {0} 和 {1} 之间的字符串"),
    range: jQuery.validator.format("请输入一个介于 {0} 和 {1} 之间的值"),
    max: jQuery.validator.format("请输入一个最大为 {0} 的值"),
    min: jQuery.validator.format("请输入一个最小为 {0} 的值")
});

// zmc: input or edit list.
$.fn.zlist = function (opts, params) {
    var $elem = $(this);
    var options = $.extend({rowNumber: true}, opts, {name: $elem.data("name")});

    if (typeof opts === 'string' || opts instanceof String) {
        return $.fn.zlist.methods[opts](this, params);
    }

    var $z_hidden = $("<input class='zlist-hidden' type='hidden' name='" + options.name + "' />");
    $elem.html("<table class='table table-striped table-hover'><thead></thead><tbody></tbody></table>")
        .append($z_hidden);
    $elem.append($z_hidden);
    $elem.data("name", options.name);

    var $table = $("table", this);
    var $tbody = $table.find("tbody");
    $tbody.on("click", "tr", function () {
        $(this).siblings().removeClass('active').end().addClass('active');
    });
    var $thead = $table.find("thead").html(
        "<tr>" + (!!options.rowNumber ? "<th style='width:30px'>#</th>" : "") +
        $.map(options.columns, function (n) {
            return "<th " + (!!n.width ? ("style='width:" + n.width + "'") : "") + " >" + n.title + "</th>";
        }).join("")
        + "<th style='width:80px'></th><tr>"
    );

    var $btnAdd = $("<a href='javascript:void(0)' class='btn btn-xs btn-success pull-right' title='尾部追加'><i class='fa fa-plus'></i></a>")
        .click(function () {
            appendRow();
        });
    var $btnAddBefore = $("<a href='javascript:void(0)' class='btn btn-xs btn-success pull-right' title='在选中行前添加' style='margin-right:1em'><i class='fa fa-plus-circle'></i></a>")
        .click(function () {
            prependRow();
        });
    $("th:last", $thead).append($btnAdd).append('&nbsp;&nbsp;').append($btnAddBefore);
    var $btnDelete = $("<a href='javascript:void(0)' class='btn btn-xs btn-danger pull-right'><i class='fa fa-trash'></i>append</a>");
    //$elem.append($btnAdd.wrap("<div></div>"))
    var _tplNewRow = "<tr>" + (!!options.rowNumber ? "<td>#</td>" : "") + $.map(options.columns, function (n) {
            var dtype = n.type || 'text';
            var strInput = '';
            switch (dtype) {
                case 'select':
                    strInput = '<select class="form-control z-field" name="{0}" data-field="{0}">'.format(n.name) + $.map(n.options, function (opt) {
                            return '<option v=' + opt.v + '>' + opt.t + '</option>';
                        }).join('') + '</select>'
                    break;
                case 'checkbox':
                    strInput = "<input type='checkbox' class='z-field pull-center' name='{0}' data-field='{0}' {1} />".format(n.name, !!n.checked ? ' checked=checked ' : '');
                    break;
                case 'text':
                default:
                    strInput = "<input type='text' class='form-control z-field' name='{0}' data-field='{0}'  />".format(n.name);
                    break;
            }

            return "<td class='td-field' data-field='" + n.name + "'>" + strInput + "</td>";
        }).join("") + "<td><a href='javascript:void(0)' class='btn btn-xs btn-danger btn-delete pull-right'><i class='fa fa-trash'></i></a></td></tr>";

    //
    var getRowHtml = function (row_data) {
        var _tplNewRow = "<tr {0}>" + (!!options.rowNumber ? "<td>#</td>" : "") + $.map(options.columns, function (n) {
                var dtype = n.type || 'text';
                var strInput = '';
                switch (dtype) {
                    case 'select':
                        strInput = '<select class="form-control z-field" name="{0}" data-field="{0}">'.format(n.name) + $.map(n.options, function (opt) {
                                return '<option v=' + opt.v + '>' + opt.t + '</option>';
                            }).join('') + '</select>'
                        break;
                    case 'checkbox':
                        strInput = "<input type='checkbox' class='z-field pull-center' name='{0}' data-field='{0}' {1} />".format(n.name, !!n.checked ? ' checked=checked ' : '');
                        break;
                    case 'text':
                    default:
                        strInput = "<input type='text' class='form-control z-field' name='{0}' data-field='{0}'  />".format(n.name);
                        break;
                }

                return "<td class='td-field' data-field='" + n.name + "'>" + strInput + "</td>";
            }).join("") + "<td style='width:40px'><a href='javascript:void(0)' class='btn btn-xs btn-danger btn-delete pull-right'><i class='fa fa-trash'></i></a></td></tr>";
    };

    var genRowHtml = function (row_data) {
        var row = $(_tplNewRow);
        if (!!row_data) {
            row.data("id", row_data.id || '');
            $("input[name],select[name]", row).each(function () {
                var input = $(this);
                var f = input.data("field");
                if (!!row_data[f]) {
                    input.val(row_data[f]);
                }
            });
        }
        $('.btn-delete', row).click(function () {
            $(this).closest('tr').remove();
            showRowNumbers();
        });
        return row;
    };

    // 添加行
    var appendRow = function (row_data) {
        var row = genRowHtml(row_data);
        $tbody.append(row);
        row.siblings().removeClass('active').end().addClass('active');
        showRowNumbers();
        return row;
    };

    // 在选中行前插入新行
    var prependRow = function (row_data) {
        var tr = $tbody.find("tr.active");
        var row = genRowHtml(row_data);
        if (tr.size() == 0) {
            $tbody.append(row);
        }
        else {
            tr.before(row);
        }
        row.siblings().removeClass('active').end().addClass('active');
        showRowNumbers();
        return row;
    };

// 显示行号
    var showRowNumbers = function () {
        if (!options.rowNumber) {
            return;
        }
        var idx = 1;
        $tbody.find("tr").each(function () {
            $(">td:first", this).html(idx++);
        })
    };

    $.fn.zlist.methods = {
        //收集数据
        collect: function (jq) {
            var v = {};
            $(".zlist").each(function () {
                var elem = $(this);
                var name = elem.data("name");
                var arr = [];
                $("tbody>tr", elem).each(function () {
                    var v1 = {};
                    $(".td-field", $(this)).each(function () {
                        var input = $(this).children();
                        if (input.is($('[type=checkbox]'))) {
                            v1[input.data("field")] = input.is(":checked") ? 1 : 0;
                        } else {
                            v1[input.data("field")] = input.val();
                        }
                    });
                    arr.push(v1);
                });
                v[name] = arr;
                $(".zlist-hidden", elem).val(JSON.stringify(arr));
            });
            return v;
        },
        //加载数据
        loaddata: function (jq, paras) {
            $.getJSON(paras.url, paras.qdata, function (data) {
                for (var i = 0; i < data.cols.length; i++) {
                    var col = data.cols[i];
                    appendRow(col);
                    /*
                     $("input[name],select[name]", tr).each(function () {
                     var input = $(this);
                     var f = input.data("field");
                     if (!!col[f]) {
                     input.val(col[f]);
                     }
                     });*/
                }

            });
        },
        selectRow: function (row) {
            row.siblings().removeClass('active').end().addClass('active');
        }
    };
}
;

