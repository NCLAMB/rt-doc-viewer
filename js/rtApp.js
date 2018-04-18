"use strict";

var rtApp = rtApp || {
    guid: function() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }

        return s4() +
            s4() +
            '-' +
            s4() +
            '-' +
            s4() +
            '-' +
            s4() +
            '-' +
            s4() +
            s4() +
            s4();
    },
   

     CurrentSize: "",
     createCookie: function(name, value, days) {
        var date, expires;
        if (days) {
            date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toGMTString();
        } else {
            expires = "";
        }
        document.cookie = name + "=" + value + expires + "; path=/";
     },
     getCookie:function (name) {
 var value = "; " + document.cookie;
 var parts = value.split("; " + name + "=");
 if (parts.length == 2)
     return parts.pop().split(";").shift();
 },
    GetCurrentSize: function () {
        if (Foundation.utils.is_small_only()) {
            return "small";
        }
        if (Foundation.utils.is_medium_only()) {
            return "medium";
        }
        if (Foundation.utils.is_large_only()) {
            return "large";
        }
        if (Foundation.utils.is_xlarge_only()) {
            return "xlarge";
        }
        if (Foundation.utils.is_xxlarge_only()) {
            return "xxlarge";
        }
        return "";
    },
 
    GetUrlVars: function () {
        var vars = [], hash;
        var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        for (var i = 0; i < hashes.length; i++) {
            hash = hashes[i].split('=');
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];
        }
        return vars;
    }
   

}




$(function () {
    $(document).foundation({
        offcanvas: {
            // Sets method in which offcanvas opens.
            // [ move | overlap_single | overlap ]
            open_method: 'move',
            // Should the menu close when a menu link is clicked?
            // [ true | false ]
            close_on_click: false
        }

    });

    // Swipe list
    $('.swipe-list > li').hammer().on("swiperight", function (event) {
        $(event.target).closest("li").addClass("swiped");
    });

    $('.swipe-list > li').hammer().on("swipeleft", function (event) {
        $(event.target).closest("li").removeClass("swiped");
    });

    // Hack to get off-canvas .menu-icon to fire on iOS
    $('.menu-icon ').click(function () {
        false
    });

    $(function () {

        var url = window.location.pathname,
            urlRegExp = new RegExp(url.replace(/\/$/, '') + "$"); // create regexp to match current url pathname and remove trailing slash if present as it could collide with the link in navigation in case trailing slash wasn't present there
        // now grab every link from the navigation
        $('.icon-bar a').each(function () {
            // and test its normalized href against the url pathname regexp
            if (urlRegExp.test(this.href.replace(/\/$/, ''))) {
                $(this).addClass('active');
            }
        });

    });
    // Removes empty p tags on tiles
        var removeEmptyParagraphs = function () {
            $('p:empty').remove();
        };
        removeEmptyParagraphs();

});



/*$(document).ajaxComplete(function () {


    ///////******* Sticky Headers codepen.io/chrissp26/pen/gBrdo ******//////

/*var stickyHeaders = (function () {

        var $window = $(window),
            $stickies;

        var load = function (stickies) {

            if (typeof stickies === "object" && stickies instanceof jQuery && stickies.length > 0) {

                $stickies = stickies.each(function () {

                    var $thisSticky = $(this).wrap('<div class="followWrap" />');

                    $thisSticky
                        .data('originalPosition', $thisSticky.offset().top)
                        .data('originalHeight', $thisSticky.outerHeight())
                        .parent()
                        .height($thisSticky.outerHeight());
                });

                $window.off("scroll.stickies").on("scroll.stickies", function () {
                    _whenScrolling();
                });
            }
        };

        var _whenScrolling = function () {

            $stickies.each(function (i) {

                var $thisSticky = $(this),
                    $stickyPosition = $thisSticky.data('originalPosition');

                if ($stickyPosition <= $window.scrollTop() + 60) {

                    var $nextSticky = $stickies.eq(i + 1),
                        $nextStickyPosition = $nextSticky.data('originalPosition') - $thisSticky.data('originalHeight');

                    $thisSticky.addClass("fixed");

                    if ($nextSticky.length > 0 && $thisSticky.offset().top >= $nextStickyPosition) {

                        $thisSticky.addClass("absolute").css("top", $nextStickyPosition);
                    }

                } else {

                    var $prevSticky = $stickies.eq(i - 1);

                    $thisSticky.removeClass("fixed");

                    if ($prevSticky.length > 0 && $window.scrollTop() <= $thisSticky.data('originalPosition') - $thisSticky.data('originalHeight')) {

                        $prevSticky.removeClass("absolute").removeAttr("style");
                    }
                }
            });
        };

        return {
            load: load
        };
    })();

    $(function () {
        if (Foundation.utils.is_small_only()) {
            stickyHeaders.load($(".stick"));
        }
    });
});

*/


$(document).ready(function () {
    $('.tooltipster').tooltipster();


});
