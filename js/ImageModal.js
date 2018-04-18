var rtApp = rtApp || {};
rtApp.CmsHtmlField = rtApp.CmsHtmlField || {};
rtApp.CmsHtmlField.ImageModalPopup = rtApp.CmsHtmlField.ImageModalPopup || {
    // **************
    // * Properties *
    // **************
    CancelButton: function () { return $("#button-cancel") },
    CloseModalLink: function () { return $("#CloseModalLink") },
    Comments: function () { return $("#Comments") },
    PublishButton: function () { return $("#PublishButton") },
    SaveImageButton: function () { return $("#button-save-image") },
    UploadMessageRow: function () { return $("#upload-message-row") },
    DeleteImageButton: function () { return $("#button-delete-image") },

    // **********
    // * Events *
    // **********
 
    WireUpModalEvents: function() {

        var modalPopup = rtApp.CmsHtmlField.ImageModalPopup;
        $("#input-imagefilename").filestyle({ placeholder: "No file", buttonBefore: true });
        modalPopup.CancelButton().on("click", modalPopup.onCancelClick);
        modalPopup.SaveImageButton().on("click", modalPopup.onSaveImageClick);
        modalPopup.DeleteImageButton().on("click", modalPopup.onDeleteImageClick);
    },
    onCancelClick: function () {
        rtApp.CmsHtmlField.ImageModalPopup.CloseModalLink().click();
    },
    onSaveImageClick: function () {
        //var article = rtApp.Blogs.Article;
        var modalPopup = rtApp.CmsHtmlField.ImageModalPopup;
        //validation
        if ($("#input-imagefilename").val().length === 0 && $("#ImageFileName").val().length === 0) {
            $("#FilenameValidation").show();
            return;
        } else {
            $("#FilenameValidation").hide();
        }

        modalPopup.CancelButton().addClass('disabled');
        modalPopup.SaveImageButton().addClass('disabled');
        //upload new file
        if ($("#input-imagefilename").val().length > 0) {

            var data = new FormData();
            var files = $("#input-imagefilename").get(0).files;
            var filename = files[0].name;
            var relativeFileNamePath = $("#ContainerPath").val() + "-" + filename;
            var fullFileNamePath = $("#BlobUrl").val() + "/" +relativeFileNamePath;

            if (files.length > 0) {
                data.append("HelpSectionImages", files[0]);
            }

            modalPopup.UploadMessageRow().show();
            $.ajax({
                url: "/NoteArticle/UploadImage?filename=" + relativeFileNamePath,
                type: "POST",
                processData: false,
                contentType: false,
                data: data,
                success: function (response) {
                    //successfully uploaded new image to blob store
                    $("#" + $("#ImageElementId").val()).attr("src", fullFileNamePath);
                    $("#" + $("#ImageElementId").val()).data("filename", filename);


                    $("#ImageFileName").val(filename);
                    modalPopup.SetHostPageField();
                },
                error: function (er) {
                    alert(er);
                }

            });

        } else {
            //just save field values
            modalPopup.SetHostPageField();
        }

    },
    isUrlValid: function (url) {
        return /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(url);

    },
    onDeleteImageClick: function () {
        var modalPopup = rtApp.CmsHtmlField.ImageModalPopup;
        var imageObject = $("#" + $("#ImageElementId").val());

        imageObject.attr("src", "/assets/img/rt-add-image.png");
        imageObject.attr("alttext", "");
        imageObject.data("caption", "");
        imageObject.data("alttext", "");
        imageObject.data("filename", "");

    
        var id = $("#ImageElementId").val();

        modalPopup.SaveDraftImageToDb(id, "", "", "");

        modalPopup.CloseModalLink().click();
    },
    SetHostPageField: function () {
        var modalPopup = rtApp.CmsHtmlField.ImageModalPopup;
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

        modalPopup.SaveDraftImageToDb(id, caption, filename, caption);
    
    },
    SaveDraftImageToDb: function (id, caption, filename, alttext) {
        var modalPopup = rtApp.CmsHtmlField.ImageModalPopup;
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
        $(document).on("opened.fndtn.reveal", "#cms-image-modal-form[data-reveal]", function () {
            rtApp.CmsHtmlField.ImageModalPopup.WireUpModalEvents();
        });
    });

