"use strict";

var rtApp = rtApp || {};
rtApp.Reminders = rtApp.Reminders ||
{
    CheckReminders:function() {
        $.ajax({
            url: "/profile/ReminderAjaxHandler",
            //type: "POST",
            dataType: "json",

            success: rtApp.Reminders.GetReminders_Success,
            error: rtApp.Reminders.GetReminders_Fail
        });
    },
    GetReminders_Success:function(data) {
        for (var i = 0, len = data.length; i < len; i++) {

            var alert = data[i];
         
                var size = "large";
                if (Foundation.utils.is_small_only()) {

                    size = "medium";
                }

                $.growl.notice({
                    duration: 15000,
                    size: size,
                    location: "tc",
                    title: "<a href='" + alert.Url + "'>" + alert.Title + "</a>",
                    message: "<a href='" + alert.Url + "'>" + alert.Message + "</a>"
                });
            

        }

    },
    GetReminders_Fail: function () {

    },
}
