"use strict";

var rtApp = rtApp || {};
rtApp.MediaModal = rtApp.MediaModal ||
{
    MakeMediaModal:function() {
        var mediaLinks = $(".media-tile-link");

        mediaLinks.each(function () {
            var anchor = $(this);
            anchor.attr("href", anchor.data("modal-url"));
        });

    },
    AttachLargeModalEvents:function() {
        if (Foundation.utils.is_large_up()) {
            var mediaLinks = $(".has-large-modal");
            mediaLinks.off("click");
            mediaLinks.click(function (event) {
                event.preventDefault();
                var url = $(event.currentTarget).data("large-modal-url");
                $("#media-modal-form").foundation("reveal", "open", url);

            });
        };

    }
}
//$(window).scroll(function () {

//    //after window scroll fire it will add define pixel added to that element.
//   var set = $(document).scrollTop() + "px";

//    //this is the jQuery animate function to fixed the div position after scrolling.
//    $('.media-modal').animate({ top: set }, { duration: 1000, queue: false });
//});

$(document)
    .ready(function () {
        rtApp.MediaModal.AttachLargeModalEvents();
    });