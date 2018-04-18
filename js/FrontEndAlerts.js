"use strict";

var rtApp = rtApp || {};
rtApp.FrontEndAlerts = rtApp.FrontEndAlerts ||
{
    DisplayAlerts: function() {
        $.ajax({
            url: "/FrontEndAlert/GetActiveFrontEndAlertsAjaxHandler",
            type: "POST",
            dataType: "json",

            success: rtApp.FrontEndAlerts.DisplayAlerts_Success,
            error: rtApp.FrontEndAlerts.DisplayAlerts_Fail
        });
    },
    DisplayAlerts_Success: function (data) {
        for (var i = 0, len = data.length; i < len; i++) {

            var alert = data[i];
            var alertId = alert.FrontEndAlertId;
            var cookieName = "alert_" + alertId;
            if (rtApp.getCookie(cookieName) !== "true") {
                var size = "large";
                if (Foundation.utils.is_small_only()) {
                   
                    size = "medium";
                }
               
                $.growl.notice({
                    duration: 15000,
                    size: size,
                    location: "tc",
                    title: "",
                    message: alert.AlertText
                });
                rtApp.createCookie(cookieName, "true", 1);
            }
          
        }

    },
    DisplayAlerts_Fail: function () {

    }
};


$(document).ready(function () {
    rtApp.FrontEndAlerts.DisplayAlerts();
});