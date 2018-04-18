"use strict";

var rtApp = rtApp || {};
rtApp.SignupModal = rtApp.SignupModal ||
{
    /*************
    * Properties *
    *************/
    // Register inputs
    Email: function () { return $("#Email") },
    EmailConfirm: function () { return $("#ConfirmEmail") },
    FullName: function () { return $("#FullName")},
    Password: function() { return $("#Password") },
    PasswordConfirm: function () { return $("#ConfirmPassword") },
    Title: function () { return $("#RegisterCommonViewModel_Title") },
    RegisterButton: function () { return $("#register-modal-submitbutton") },

    /*********
    * Events *
    *********/
 
    onFormRegisterSubmit: function (e) {
        var signupModal = rtApp.SignupModal;
        var fullName = signupModal.FullName().val();
        var fullNameArray = fullName.split(" ");
       
        var isItCompanyPage = $("#IsFromCompanySignup").val()==="True";
        var companyOfInterest= "";
        var isItBlogPage = $("#IsFromBlogSignup").val() === "True";
      
        if (isItCompanyPage) {
            companyOfInterest = $("#CompanyNameOfInterest").val();
        } 

        if (signupModal.CheckRegisterFormInputs() ) {

            $(".busy-spinner").show();
            signupModal.RegisterButton().attr('disabled', true);
            $(".btn-external-login").attr('disabled', true);
            $.ajax({
                url: "/Account/ValidateRegistrationFormAjaxHandler",
                type: "POST",
                dataType: "json",
                data: {
                    confirmemail: signupModal.Email().val(),
                    email: signupModal.Email().val(),
                    password: signupModal.Password().val(),
                    confirmpassword: signupModal.Password().val(),                    
                    FirstName: fullNameArray[0],
                    LastName: fullNameArray[1],
                    CompanyNameOfInterest: companyOfInterest,
                    FullName: fullName,
         
                    IsFromBlogSignup: isItBlogPage,
                    IsFromCompanySignup : isItCompanyPage
                },

                success: signupModal.RegisterValidate_Success,
                error: signupModal.RegisterValidate_Fail
            });

        }

        e.preventDefault();
    },

    RegisterValidate_Fail: function (data) {

    },
    RegisterValidate_Success: function (data) {

        var isValid = data.InputsAreValid === true;
        var signupModal = rtApp.SignupModal;
        var reloadPage = data.reloadPage;
        var forwardToAccountValidationMessage = data.forwardToAccountValidationMessage;
        var forwardToPasswordResetMessage = data.forwardToPasswordResetMessage;
        var forwardToEmailValidation = data.forwardToEmailValidationPage;

        if (isValid === true) {
            var url = "";
            if (forwardToEmailValidation) {
                url = "/account/CommercialSalesModal";
                $("#register-user-type-modal-form").foundation("reveal", "open", url);
            } else if (forwardToAccountValidationMessage) {
                url = "/account/AccountNeedValidatingModal";
                $("#register-user-type-modal-form").foundation("reveal", "open", url);
            } else if (forwardToPasswordResetMessage) {
                url = "/account/PasswordNeedsResetModal";
                $("#register-user-type-modal-form").foundation("reveal", "open", url);
            } else if (reloadPage) {
                window.location.href = window.location.href;
            }  else {
                window.location.href = "/offering/retail";
            }
        } else {
            $(".busy-spinner").hide();
            signupModal.RegisterButton().attr("disabled", false);
            $(".btn-external-login").attr("disabled", false);
            signupModal.ProcessRegisterServerErrors(data);
        }

    },


    /**********
    * Methods *
    **********/
    
    CheckRegisterFormInputs: function () {
        var isValid = true;
        var signupModal = rtApp.SignupModal;

        var email = signupModal.Email().val();
        var fullname = signupModal.FullName().val();
        var password = signupModal.Password().val();

        signupModal.SetValidationMessage("Email", "");
        signupModal.SetValidationMessage("Password", "");
        signupModal.SetValidationMessage("FullName", "");

        if (email === "") {
            signupModal.SetValidationMessage("Email", "Please enter a valid email address");
            $("#reg-modal-blank-space").show();
            isValid = false;
        }

        if (password === "") {
            signupModal.SetValidationMessage("Password", "Please enter a valid password");
            $("#reg-modal-blank-space").show();
            isValid = false;
        }

        if (fullname === "") {
            signupModal.SetValidationMessage("FullName", "Please enter your full name");
            $("#reg-modal-blank-space").show();
            isValid = false;
        }

        return isValid;
    },
  
    RegisterOpenModalEvent: function () {
        $(document).on("open.fndtn.reveal", "#register-modal-form[data-reveal]", function () {
            if (Foundation.utils.is_small_only()) {
                $("#register-modal-form").removeClass("tiny");
                $("#register-modal-form").removeClass("medium");
                // $("#login-modal-form").addClass("Large");
            }
            if (Foundation.utils.is_medium_only()) {
                $("#register-modal-form").removeClass("tiny");
                $("#register-modal-form").addClass("medium");
            }
            if (Foundation.utils.is_large_up()) {

                $("#register-modal-form").removeClass("medium");
                $("#register-modal-form").addClass("tiny");
            }
            //close login modal if open
            //$("#login-modal-form").foundation("reveal", "close");
        });
        $(document).on("opened.fndtn.reveal", "#register-modal-form[data-reveal]", function () {
            rtApp.SignupModal.InitPopup();
        });
    },
    InitPopup: function () {
        var signupModal = rtApp.SignupModal;

        $("#register-modal-submitbutton").click(signupModal.onFormRegisterSubmit);
    },

  
    ProcessRegisterServerErrors: function (data) {
        var signupModal = rtApp.SignupModal;

        signupModal.SetValidationMessage("Email", data.emailFeedback);
        signupModal.SetValidationMessage("Password", data.passwordFeedback);
        signupModal.SetValidationMessage("FullName", data.fullNameFeedback);
    
    },
    SetValidationMessage: function (controlName, msg) {
        var signupModal = rtApp.SignupModal;
        var labelControl = $("#" + controlName + "ValidationMessage");
        var inputControl = $("#" + controlName);
        if (msg === "") {
            labelControl.removeClass("field-validation-error");
            labelControl.addClass("field-validation-valid");
            inputControl.removeClass("error");

            labelControl.text("");
        } else {
            labelControl.removeClass("field-validation-valid");
            labelControl.addClass("field-validation-error");
            inputControl.addClass("error");
            labelControl.text(msg);
            signupModal.RegisterButton().addClass("shake-me");
            setTimeout(
                  function () {
                      signupModal.RegisterButton().removeClass("shake-me");
                  },
                  500);
        }
    }

}
$(document).ready(function () {
    var signupModal = rtApp.SignupModal;

    signupModal.RegisterOpenModalEvent();
   
});

