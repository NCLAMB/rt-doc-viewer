var rtApp = rtApp || {};
rtApp.CmsHtmlField = rtApp.CmsHtmlField || {};
rtApp.CmsHtmlField.HeroImageModalPopup = rtApp.CmsHtmlField.HeroImageModalPopup || {
    // **************
    // * Properties *
    // **************
    CancelButton: function () { return $("#button-cancel") },
    CloseModalLink: function () { return $("#CloseModalLink") },
    Comments: function () { return $("#Comments") },
    PublishButton: function () { return $("#PublishButton") },
    SaveImageButton: function () { return $("#button-save-image") },
    UploadMessageRow: function () { return $("#upload-message-row") },

    // **********
    // * Events *
    // **********
    onCancelClick: function () {
        rtApp.CmsHtmlField.HeroImageModalPopup.CloseModalLink().click();
    },
    WireUpModalEvents: function () {

        var heroImageModalPopup = rtApp.CmsHtmlField.HeroImageModalPopup;
      
        heroImageModalPopup.CancelButton().on("click", heroImageModalPopup.onCancelClick);
        heroImageModalPopup.SaveImageButton().on("click", heroImageModalPopup.onSaveImageClick);

        setTimeout(
                  function () {
                      $("#input-imagefilename").filestyle({ placeholder: "No file", buttonBefore: true });
                  },
                  50);

    },
    onSaveImageClick: function () {
        //var article = rtApp.Blogs.Article;
        var modalPopup = rtApp.CmsHtmlField.HeroImageModalPopup;
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
            var fullFileNamePath = $("#BlobUrl").val() + "/" + relativeFileNamePath;

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
                    $("#" + $("#ImageElementId").val()).css("background-image", "url(" + fullFileNamePath + ")");
                    //$("#" + $("#ImageElementId").val()).attr("src", fullFileNamePath);
                    $("#" + $("#ButtonId").val()).data("filename", filename);


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

    SetHostPageField: function () {
        var modalPopup = rtApp.CmsHtmlField.HeroImageModalPopup;
        var filename = $("#ImageFileName").val();


        var id = $("#ImageElementId").val();

        modalPopup.SaveDraftImageToDb(id, filename);

    },
    SaveDraftImageToDb: function (id, filename) {
        var modalPopup = rtApp.CmsHtmlField.HeroImageModalPopup;
        $.ajax({
            url: "/cms/SetDraftCmsInlineHeroImage",
            type: "POST",
            dataType: "json",
            data: {
                id: id,
                imageFilename: filename

            },

            success: function () {
                modalPopup.CloseModalLink().click();
            },
            error: function () {
                $.growl.error({ message: "Error saving image" });
            }
        });
    }

    // ************************
    // * Methods & Procedures *
    // ************************


};

$(document)
    .ready(function() {
        $(document).on("opened.fndtn.reveal",
            "#hero-cms-modal-form[data-reveal]",
            function() {
                rtApp.CmsHtmlField.HeroImageModalPopup.WireUpModalEvents();
            });
    });


