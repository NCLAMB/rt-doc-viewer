"use strict";

var rtApp = rtApp || {};
rtApp.LazyLoad = rtApp.LazyLoad ||
{
    Init: function() {

        $("img.lazy").lazyLoadXT();
        //var $lazyBg = $('[data-bg]');
        //$lazyBg.on('lazyshow',
        //    function(e) {
        //        $(this).fadeTo("fast", 1);
        //    });
    }

};


$(document).ready(function () {

    rtApp.LazyLoad.Init();

});