"use strict";

var rtApp = rtApp || {};
rtApp.AddToWatchlist = rtApp.AddToWatchlist ||
{
    AddButton_Click: function (e) {
        e.preventDefault();
        var companyName = $(this).data("cname");
        var companyId = $(this).data("cid");
        $.ajax({
            url: "/Dashboard/AddCompanyToWatchListAjaxHandler",
            type: "POST",
            dataType: "json",
            data: { id: companyId },

            success: rtApp.AddToWatchlist.AddCompanySuccess,
            error: rtApp.AddToWatchlist.AddCompanyFail
        });
    },
    AddCompanySuccess: function (data) {
        rtApp.EmailAlert.Show();

        $.growl({ title: "", message: data });
        if (data === "Company added") {
            $("#watchListSearch").val("");
            $("#SiteSearch").val("");
            if (rtApp.Dashboard !== undefined) {

                rtApp.Dashboard.DrawAllWidgets(false);
            }
            if (rtApp.Corporate !== undefined) {

                rtApp.Corporate.DrawNotCoreWidgets();


            }

        }
    },
    AddCompanyFail: function () {
        $.growl.error({ message: "Sorry an error occurred when adding a company to the watch list" });
    }

}
