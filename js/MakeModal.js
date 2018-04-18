"use strict";

var rtApp = rtApp || {};
rtApp.MakeModal = rtApp.MakeModal ||
{
    AttachModalEvents: function() {

        var mediaLinks = $(".make-modal");
        mediaLinks.off("click");
        mediaLinks.click(function (event) {
           
            if (Foundation.utils.is_medium_only() || Foundation.utils.is_small_only()) {
                window.scrollTo(0, 0); 
                
            }
            event.preventDefault();
            var url = $(event.currentTarget).data("modal-url");
            var modalForm = $(event.currentTarget).data("modal-form");
            $("#" + modalForm).foundation("reveal", "open", url);

        });

    }
}

$(document).ready(function() {
    rtApp.MakeModal.AttachModalEvents();
});