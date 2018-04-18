"use strict";

var rtApp = rtApp || {};
rtApp.AjaxWidgets = rtApp.AjaxWidgets ||
{

    LoadAjaxWidgets:function() {
        var placeholders = $(".ajax-widget-placeholder");
        placeholders.each(function () {
            var placeholder = $(this);
            var url = placeholder.data("url");
            var complete = placeholder.data("complete");
            if (complete !== "true") {

                placeholder.hide();
                placeholder.load(url,
                    function () {
                        setTimeout(
                  function () {
                      $(document).foundation();
                      rtApp.MediaModal.AttachLargeModalEvents();
                      placeholder.fadeIn();
                      placeholder.data("complete", "true");
                      $("img.lazy").lazyLoadXT();

                  },
                  50);
                  
                    });
            }

        });

    }

}

$(document).ready(function () {
    rtApp.AjaxWidgets.LoadAjaxWidgets();
});