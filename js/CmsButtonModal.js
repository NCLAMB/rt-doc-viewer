var rtApp = rtApp || {};
rtApp.CmsHtmlField = rtApp.CmsHtmlField || {};
rtApp.CmsHtmlField.CmsButtonModal = rtApp.CmsHtmlField.CmsButtonModal || {
    // **************
    // * Properties *
    // **************
    CancelButton: function () { return $("#button-cancel") },
    CloseModalLink: function () { return $("#CloseModalLink") },
    UploadMessageRow: function () { return $("#upload-message-row") },

    SaveButton: function () { return $("#button-save") },
 
    // **********
    // * Events *
    // **********

    ClearAndDisableUrl: function() {
        $("#buttonurl").val("");
        $("#buttonurl").prop("disabled", true);
    },
    EnableUrl: function() {
        $("#buttonurl").prop("disabled", false); 
    },
    WireUpModalEvents: function () {

        var modalPopup = rtApp.CmsHtmlField.CmsButtonModal;
      
        modalPopup.CancelButton().on("click", modalPopup.onCancelClick);
        modalPopup.SaveButton().on("click", modalPopup.onSaveClick);

        $("#lbl-open-in-new-tab")
            .click(function () {
                $("#OpenLoginModal").attr("checked", false);
                $("#OpenRegModal").attr("checked", false);
                $("#OpenContactUsModal").attr("checked", false);
                
                modalPopup.EnableUrl();
                
            });
        $("#lbl-open-login-modal")
            .click(function () {
                $("#OpenInNewTab").attr("checked", false);
                $("#OpenRegModal").attr("checked", false);
                $("#OpenContactUsModal").attr("checked", false);
                if ($("#OpenLoginModal").attr("checked") === 'checked') {
                    modalPopup.EnableUrl();
                } else {
                    modalPopup.ClearAndDisableUrl();
                    
                }
            });
        $("#lbl-open-reg-modal")
            .click(function () {
                $("#OpenLoginModal").attr("checked", false);
                $("#OpenInNewTab").attr("checked", false);
                $("#OpenContactUsModal").attr("checked", false);
                if ($("#OpenRegModal").attr("checked") === 'checked') {
                    modalPopup.EnableUrl();
                } else {
                    modalPopup.ClearAndDisableUrl();
                }
            });
        $("#lbl-open-contact-us-modal")
            .click(function () {
                $("#OpenLoginModal").attr("checked", false);
                $("#OpenRegModal").attr("checked", false);
                $("#OpenInNewTabl").attr("checked", false);
                if ($("#OpenContactUsModal").attr("checked") === 'checked') {
                    modalPopup.EnableUrl();
                } else {
                    modalPopup.ClearAndDisableUrl();
                }
            });

    },
    onCancelClick: function () {
        rtApp.CmsHtmlField.CmsButtonModal.CloseModalLink().click();
    },
    onSaveClick: function () {
        //var article = rtApp.Blogs.Article;
        var modalPopup = rtApp.CmsHtmlField.CmsButtonModal;
      
        //validation
        var id = $("#CmsButtonId").val();
        var buttonText = $("#buttontext").val();
        var openInNewTab = $("#OpenInNewTab").attr('checked') === "checked";
        var openLoginModal = $("#OpenLoginModal").attr('checked') === "checked";
        var openRegModal = $("#OpenRegModal").attr('checked') === "checked";
        var openContactUsModal = $("#OpenContactUsModal").attr('checked') === "checked";

        var buttonUrl = $("#buttonurl").val();

        if (buttonText.length > 0 && buttonUrl.length === 0 && !openLoginModal && !openRegModal && !openContactUsModal) {
            $("#url-error").show();
            return;
        } else {
            $("#url-error").hide();
        }
        if (buttonUrl.length > 0 && buttonText.length===0) {
            $("#text-error").show();
            return;
        } else {
            $("#text-error").hide();
        }
        if (buttonUrl.length > 0 && !modalPopup.isUrlValid(buttonUrl)) {
            $("#url-error").show();
            return;
        } else {
            $("#url-error").hide();
        }


        modalPopup.CancelButton().addClass('disabled');
        modalPopup.SaveButton().addClass('disabled');

        modalPopup.UploadMessageRow().show();
            $.ajax({
                url: "/cms/SetDraftCmsButton",
                type: "POST",
                dataType: "json",
                data: {
                    id: id,
                    url: buttonUrl,
                    text: buttonText,
                    openInNewTab: openInNewTab,
                    openLoginModal: openLoginModal,
                    openRegModal: openRegModal,
                    openContactUsModal: openContactUsModal
                },
                success: function (response) {
                    var button = $("#" + id);
                    if (buttonText.length > 0) {
                        button.text(buttonText);
                    } else {
                        button.text("Click here to edit");
                    }
                    button.attr("href", buttonUrl);
                    //modalPopup.SetHostPageField();
                    modalPopup.CloseModalLink().click();
                },
                error: function () {
                    $.growl.error({ message: "Error saving image" });
                }

            });

      

    },
    isUrlValid: function (url) {
        return /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(url);

    },

    SetHostPageField: function () {
        var modalPopup = rtApp.CmsHtmlField.CmsButtonModal;
        var filename = $("#ImageFileName").val();
        var alttext = $("#AltText").val();
        var caption = $("#Caption").val();
        var container = $("#ContainerPath").val();

        //set caption text on source image
        var captionObject = $("#" + $("#CaptionElementId").val());
        captionObject.html(caption);

        // set properties on source image
        var imageObject = $("#" + $("#ImageElementId").val());

        imageObject.attr("alttext", alttext);
        imageObject.data("caption", caption);
        imageObject.data("alttext", alttext);

        var id = $("#ImageElementId").val();

        modalPopup.SaveDraftButtonToDbClick(id, caption, filename, caption);

    },
    SaveDraftButtonToDbClick: function (id, caption, filename, alttext) {
        var modalPopup = rtApp.CmsHtmlField.CmsButtonModal;
        $.ajax({
            url: "/cms/SetDraftCmsInlineImage",
            type: "POST",
            dataType: "json",
            data: {
                id: id,
                caption: caption,
                imageFilename: filename,
                altText: alttext

            },

            success: function () {
                modalPopup.CloseModalLink().click();
            },
            error: function () {
                $.growl.error({ message: "Error saving image" });
            }
        });
    },

    // ************************
    // * Methods & Procedures *
    // ************************


};

$(document)
    .ready(function () {
        $(document).on("opened.fndtn.reveal", "#cms-button-modal-form[data-reveal]", function () {
            rtApp.CmsHtmlField.CmsButtonModal.WireUpModalEvents();
        });
    });

