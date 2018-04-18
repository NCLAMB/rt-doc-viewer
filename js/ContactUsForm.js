"use strict";

var rtApp = rtApp || {};
rtApp.ContactUs = rtApp.ContactUs || {};

rtApp.ContactUs.ContactUsForm = rtApp.ContactUs.ContactUsForm ||
{

    
    DocumentReady: function () {
      
        var contactUsForm = rtApp.ContactUs.ContactUsForm;

        contactUsForm.WireUpEvents();
    },

    WireUpEvents: function () {
     
        $('#save-btn').click(function (e) {


            e.preventDefault();
            var form = $("#ContactUsFormModal");
            var valid = form.valid();
            if (valid) {
                $('#save-btn').attr("disabled", true);
                $('#close-btn').attr("disabled", true);
                $('.load-spinner').show();
                $.ajax({
                    url: "/contact/ContactUsFormModal",
                    type: "POST",
                    data: $(form).serialize(),
                    success: function(response) {
                        $('#message').show();
                        $('#form').hide();
                    }
                });
            } else {
                $("#save-btn").addClass("shake-me");
                setTimeout(
                      function () {
                          $("#save-btn").removeClass("shake-me");
                      },
                      500);
               
            }
        });
     
        $('#close-btn').click(function () {
            $('#tiny-modal-form').foundation('reveal', 'close');
        });
        $('#close-button').click(function () {
            $('#tiny-modal-form').foundation('reveal', 'close');
        });
    }

}

$(document).ready(function () {
    $(document).on("open.fndtn.reveal", "#contact-us-modal-form[data-reveal]", function () {
        if (Foundation.utils.is_small_only()) {
            $("#contact-us-modal-form").removeClass("tiny");
            $("#contact-us-modal-form").removeClass("medium");
            // $("#login-modal-form").addClass("Large");
        }
        if (Foundation.utils.is_medium_only()) {
            $("#contact-us-modal-form").removeClass("tiny");
            $("#contact-us-modal-form").addClass("medium");
        }
        if (Foundation.utils.is_large_up()) {

            $("#contact-us-modal-form").removeClass("medium");
            $("#contact-us-modal-form").addClass("tiny");
        }
       
        
    });
    $(document).on("opened.fndtn.reveal", "#contact-us-modal-form[data-reveal]", function () {
      rtApp.ContactUs.ContactUsForm.DocumentReady();
    });


});