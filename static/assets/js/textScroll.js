/**
 * Created by bao on 2018/6/25.
 */
$.fn.textScroll = function () {

    var speed = 60, flag = null, tt, that = $(this), child = that.children();

    var p_w = that.width(), w = child.width();

    // child.css({left: p_w});

    var t = (w + p_w) / speed * 1000;

    function play(m) {

        var tm = m == undefined ? t : m;

        child.animate({left: -w}, tm, "linear", function () {

            $(this).css("left", 0);


            setTimeout(function () {
                play();
            },1000);

        });

    }

    play();

}