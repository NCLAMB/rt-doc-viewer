"use strict";

var rtApp = rtApp || {};
rtApp.EmailAlert = rtApp.EmailAlert ||
{
    /*************
    * Properties *
    *************/


    /*********
    * Events *
    *********/
    GetUserData_Fail: function () {
        // Do not show an error message
    },
    GetUserData_Success: function (data) {
        var receivesResearchDailyAlerts = data.receivesResearchDailyAlerts === true;
        var neverAskAgain = data.neverAskAgain === true;
        var answeredNoInLast24Hours = data.answeredNoInLast24Hours === true;

        if (!receivesResearchDailyAlerts && (!neverAskAgain && !answeredNoInLast24Hours)) {
            var emailPopup = rtApp.EmailAlert.Modal;

            // Wire up modal
            $(document).on("opened.fndtn.reveal", "[data-reveal]", function () {
                emailPopup.WireUpEvents();
            });
            
            // Show the modal
            $("#general-modal-form").foundation('reveal', 'open', "/general/EmailAlertReminder");
        }
    },
    UpdateUserData_Fail: function() {
        $("#general-modal-form").foundation('reveal', 'close');
    },
    UpdateUserData_Success: function () {
        $("#general-modal-form").foundation('reveal', 'close');
    },


    /**********
    * Methods *
    **********/
    Show: function () {
        var emailSettings = rtApp.EmailAlert;

        $.ajax({
            url: "/Profile/GetUserEmailAlertDataAjaxHandler",
            type: "POST",
            dataType: "json",

            success: emailSettings.GetUserData_Success,
            error: emailSettings.GetUserData_Fail
        });
    },
    UpdateUserEmailConfigSettings: function (state) {
        var emailSettings = rtApp.EmailAlert;

        $.ajax({
            url: "/Profile/UpdateUserEmailAlertSettings",
            type: "POST",
            dataType: "json",
            data: { state: state },

            success: emailSettings.UpdateUserData_Success,
            error: emailSettings.UpdateUserData_Fail
        });

    }
}

rtApp.EmailAlert.Modal = rtApp.EmailAlert.Modal ||
{
    /*************
    * Properties *
    *************/
    NeverShowAgainLink: function  () { return $("#btnDoNotAskAgain") },
    NoButton: function () { return $("#btnNo") },
    YesButton: function() { return $("#btnYes") },


    /*********
    * Events *
    *********/
    NeverShowAgain_Click: function(e) {
        rtApp.EmailAlert.UpdateUserEmailConfigSettings("never-again");
    },
    No_Click: function(e) {
        rtApp.EmailAlert.UpdateUserEmailConfigSettings("no");
    },
    Yes_Click: function(e) {
        rtApp.EmailAlert.UpdateUserEmailConfigSettings("yes");
    },


    /**********
    * Methods *
    **********/
    WireUpEvents: function () {
        var emailPopup = rtApp.EmailAlert.Modal;

        emailPopup.NeverShowAgainLink().on("click", emailPopup.NeverShowAgain_Click);
        emailPopup.YesButton().on("click", emailPopup.Yes_Click);
        emailPopup.NoButton().on("click", emailPopup.No_Click);
    }
}
