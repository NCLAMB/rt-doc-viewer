"use strict";

var rtApp = rtApp || {};
rtApp.Account = rtApp.Account || {};

rtApp.Account.LoginModal = rtApp.Account.LoginModal ||
{
    /*************
    * Properties *
    *************/
    LoginEmail: function () { return $("#LoginEmail") },
    LoginPassword: function () { return $("#LoginPassword") },
    ReturnUrl: function () { return $("#ReturnUrl") },

    /*********
    * Events *
    *********/
    LoginValidate_Fail: function (data) {
        var loginModal = rtApp.Account.LoginModal;

        $(".busy-spinner").hide();

        location.reload();

    },
    LoginValidate_Success: function (data) {
     
        var loginModal = rtApp.Account.LoginModal;

        var currentUrl = window.location.href;
        var isItBlogPage = $("#IsFromBlogSignup").val() === "True";
        var isItCompanyPage = $("#IsFromCompanySignup").val() === "True";

       
        if (data.success) {
            if (isItBlogPage || isItCompanyPage) {
                window.location.href = "/Profile/EmailConfig";
            } else {
                //for Disqus
                var autoClose = rtApp.GetUrlVars()["autoclose"];

                if (autoClose != undefined) {
                    window.close();
                }


                if (loginModal.ReturnUrl().val().length > 0) {
                    window.location.href = loginModal.ReturnUrl().val();
                } else {
                    window.location.href = currentUrl;
                }
                
            }
        } else {
            $(".busy-spinner").hide();
            $("#login-modal-submitbutton").attr("disabled", false);
            $(".btn-external-login").attr("disabled", false);
            loginModal.ProcessLoginServerErrors(data);
        }




    },
    onFormLoginSubmit: function (e) {
        var loginModal = rtApp.Account.LoginModal;
        var isItCompanyPage = $("#IsFromCompanySignup").val() === "True";

        if (loginModal.CheckLoginFormInputs()) {


            $(".busy-spinner").show();
            $("#login-modal-submitbutton").attr("disabled", true);
            $(".btn-external-login").attr("disabled", true);
            if (isItCompanyPage) {
                $.ajax({
                    url: "/Account/ValidateLoginFormAndAddCompanyToWatchlistAjaxHandler?companyName=" +
                        $("#CompanyNameOfInterest").val(),
                    type: "POST",
                    dataType: "json",
                    data: {
                        email: loginModal.LoginEmail().val(),
                        password: loginModal.LoginPassword().val()
                    },

                    success: loginModal.LoginValidate_Success,
                    error: loginModal.LoginValidate_Fail
                });
            } else {
                $.ajax({
                    url: "/Account/ValidateLoginFormAjaxHandler",
                    type: "POST",
                    dataType: "json",
                    data: {
                        email: loginModal.LoginEmail().val(),
                        password: loginModal.LoginPassword().val(),
                        returnUrl: loginModal.ReturnUrl().val()
                    },

                    success: loginModal.LoginValidate_Success,
                    error: loginModal.LoginValidate_Fail
                });
            }
        }

        e.preventDefault();
    },


    /**********
    * Methods *
    **********/
    CheckLoginFormInputs: function () {
        var isValid = true;
        var loginModal = rtApp.Account.LoginModal;

        var email = loginModal.LoginEmail().val();
        var password = loginModal.LoginPassword().val();

        loginModal.SetValidationMessage("LoginEmail", "");
        loginModal.SetValidationMessage("LoginPassword", "");

        if (email === "") {
            loginModal.SetValidationMessage("LoginEmail", "Please enter your email address");
            loginModal.SetValidationMessage("LoginPassword", " ");
            isValid = false;
        }

        var emailToShort = email.length <= 5;
        //var emailMissingAtSign = email.indexOf("@") < 0;
        //var emailMissingFullStop = email.indexOf(".") < 0;

        //if (emailToShort | emailMissingAtSign | emailMissingFullStop) {
        if (emailToShort) {
            loginModal.SetValidationMessage("LoginEmail", "Please enter a valid email address / username");
            loginModal.SetValidationMessage("LoginPassword", " ");
            isValid = false;
        }

        if (password === "") {
            loginModal.SetValidationMessage("LoginPassword", "Please enter your password");
            isValid = false;
        }

        return isValid;
    },
    DocumentReady: function () {
        var loginModal = rtApp.Account.LoginModal;

        loginModal.WireUpEvents();
    },
    ProcessLoginServerErrors: function (data) {
        var loginModal = rtApp.Account.LoginModal;

        loginModal.SetValidationMessage("LoginEmail", data.errors);
        loginModal.SetValidationMessage("LoginPassword", " ");

    },
    SetValidationMessage: function (controlName, msg) {
        var labelcontrol = $("#" + controlName + "ValidationMessage");
        var inputControl = $("#" + controlName);
        if (msg === "") {
            inputControl.removeClass("error");
           
            labelcontrol.removeClass("field-validation-error");
            labelcontrol.addClass("field-validation-valid");
            labelcontrol.text("");
            labelcontrol.html("");
        } else {
          
            labelcontrol.removeClass("field-validation-valid");
            labelcontrol.addClass("field-validation-error");
            inputControl.addClass("error");
            $("#login-modal-submitbutton").addClass("shake-me");
            setTimeout(
                  function () {
                      $("#login-modal-submitbutton").removeClass("shake-me");
                  },
                  500);
            labelcontrol.text(msg);
            labelcontrol.html(msg);
        }
    },
    WireUpEvents: function () {
        $("#frmLoginModal").submit(rtApp.Account.LoginModal.onFormLoginSubmit);
    }

};

rtApp.Account.LoginModal.Detected = rtApp.Account.LoginModal.Detected ||
{
    /**********
    * Methods *
    **********/
    DocumentReady: function() {
        window.location.href = "/home";
    }
};


$(document).ready(function () {
    $(document).on("open.fndtn.reveal", "#login-modal-form[data-reveal]", function () {
        if (Foundation.utils.is_small_only()) {
            $("#login-modal-form").removeClass("tiny");
            $("#login-modal-form").removeClass("medium");
           // $("#login-modal-form").addClass("Large");
        }
        if (Foundation.utils.is_medium_only()) {
            $("#login-modal-form").removeClass("tiny");
            $("#login-modal-form").addClass("medium");
        }
        if (Foundation.utils.is_large_up()) {
          
            $("#login-modal-form").removeClass("medium");
            $("#login-modal-form").addClass("tiny");
        }

        //close regiser modal if open
        //$("#register-modal-form").foundation("reveal", "close");
    });
    var openLogin = rtApp.GetUrlVars()["openlogin"];
    if (openLogin != undefined) {
        $('#login-modal-form').foundation('reveal', 'open', '/account/loginmodal');
    }

});