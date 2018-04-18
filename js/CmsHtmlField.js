"use strict";

var rtApp = rtApp || {};
rtApp.CmsHtmlField = rtApp.CmsHtmlField ||
{
    InlineImageCount: 0,
    CmsButtonCount: 0,
    NotInlineFieldCount: 0,
    InlineFieldCount: 0,
    TotalFieldCount: function() {
        return rtApp.CmsHtmlField.NotInlineFieldCount + rtApp.CmsHtmlField.InlineFieldCount;
    },
    FieldsPublishedCount: 0,
    FieldsRestoredToPublishedCount:0,
    DocReady: function() {
        this.NotInlineFieldCount = 0;
        this.InlineFieldCount = 0;
        this.ShowEditBar();
        var cmsHtmlField = rtApp.CmsHtmlField;
        
        $(".hero-button-container").each(function() { cmsHtmlField.setupCMsButtonLayout($(this)) }
        );
    },

    setupCMsButtonLayout: function (buttonContainer) {
        //determines if there are 1 or two buttons and sets up layout
        var buttonOneContainer = buttonContainer.find(".hero-button-one-container");
        var buttonTwoContainer = buttonContainer.find(".hero-button-two-container");

        var buttonTwo = buttonTwoContainer.find(".cms-button");
        if (buttonTwo.text().length===0) {
            buttonOneContainer.removeClass("large-offset-4");
            buttonOneContainer.addClass("large-offset-5");

            buttonOneContainer.removeClass("medium-offset-1");
            buttonOneContainer.addClass("medium-offset-4");
            buttonOneContainer.removeClass("medium-5");
            buttonOneContainer.addClass("medium-4");
        } else {
            buttonOneContainer.addClass("large-offset-4");
            buttonOneContainer.removeClass("large-offset-5");

            buttonOneContainer.addClass("medium-offset-1");
            buttonOneContainer.removeClass("medium-offset-4");
            buttonOneContainer.addClass("medium-5");
            buttonOneContainer.removeClass("medium-4");
        }
        buttonContainer.show();
    },
    OnEditClick: function () {
        $("#cms-loading-gif").show();
        rtApp.WorkingModal.OpenWorkingModal();
        console.log("Edit Clicked");
        var editButton = $("#cms-fields-edit");
        var cmsHtmlField = rtApp.CmsHtmlField;
        var currentMode = editButton.data("mode");
        var inlineInputs = $(".raw-html-output-container");
        cmsHtmlField.InlineFieldCount = inlineInputs.length;
        var inLineImages = $(".inline-image");
        cmsHtmlField.InlineImageCount = inLineImages.length;

        var cmsButtons = $(".cms-button");
        cmsHtmlField.CmsButtonCount = cmsButtons.length;

        var inLineHeroImages = $(".hero-container");

        if (currentMode === "default") {
            //place into edit mode
            $("#edit-dropdown").show();
            $("#cms-fields-edit").off('click');
            $("#cms-fields-edit").addClass("has-dropdown not-click");

            $(".editable-field-label").show();
            $(".editable-field-annotation-label").show();

            $(".raw-html-output-container-outline").addClass("editable-field-active");
            $(".inline-image-output-container-outline").addClass("editable-field-active");


                inlineInputs.each(function() { cmsHtmlField.setupFieldForEdit($(this)) }
                );
                inLineImages.each(function() { cmsHtmlField.setupImageForEdit($(this)) }
                );
                inLineHeroImages.each(function () { cmsHtmlField.setupHeroImageForEdit($(this)) }
                );
          
                cmsButtons.each(function () { cmsHtmlField.setupCmsButtonForEdit($(this)) }
                );
                $(".hero-button-container").each(function () { cmsHtmlField.setupCMsButtonLayout($(this)) }  );
            $(".hero-image-edit-button").show();

        }

        //set page back to default mode
        if (currentMode === "edit") {
            $("#edit-dropdown").hide();
            $("#cms-fields-edit").removeClass("has-dropdown not-click");
            tinyMCE.remove();
            cmsHtmlField.FieldsRestoredToPublishedCount = 0;
            if (cmsHtmlField.InlineFieldCount + cmsHtmlField.InlineFieldCount > 0) {
                inlineInputs.each(function () { cmsHtmlField.setFieldToPublishedValue($(this)) }
                );
                inLineImages.each(function () { cmsHtmlField.setImageToPublishedValue($(this)) }
               );
                inLineHeroImages.each(function () { cmsHtmlField.setHeroImageToPublishedValue($(this)) }  );
                cmsButtons.each(function () { cmsHtmlField.setupCmsButtonToPublishedValues($(this)) });
              
            }
            $(".hero-image-edit-button").hide();
       
        }

    },
    setupCmsButtonToPublishedValues: function (field) {
        var button = $(field);

        var id = button.data("id");
        //remove click event to open edit button modal
        field.off("click");

        var cmsHtmlField = rtApp.CmsHtmlField;
        $.ajax({
            url: "/Cms/GetPublishedCmsButton",
            type: "POST",
            dataType: "json",
            data: {
                id: id
            },

            success: function (e) {

                var buttonText = e.text;
                var buttonUrl = e.url;
                var modalUrl = "";
                var modalForm = "";
                var openModal = e.openLoginModal || e.openRegModal || e.openContactUsModal;


                if (openModal) {
                    if (buttonText.length === 0 ) {
                        button.hide();
                    }
                    if (e.openLoginModal) {
                        buttonUrl = "/account/login";
                        modalUrl = "/Account/loginmodal";
                        modalForm = "#login-modal-form";
                    }
                    if (e.openRegModal) {
                        buttonUrl = "/account/register";
                        modalUrl = "/Account/registermodal";
                        modalForm = "#register-modal-form";
                    }
                    if (e.openContactUsModal) {
                        buttonUrl = "/contact/contact";
                        modalUrl = "/contact/ContactUsFormModal";
                        modalForm = "#contact-us-modal-form";
                    }
                    button.click(function (e) {
                        e.preventDefault();
                        $(modalForm).foundation('reveal',
                            'open',
                            {
                                url: modalUrl
                            });

                    });
                } else {
                    if ((buttonText.length === 0 || buttonUrl.length === 0) ) {
                        button.hide();
                    }

                    if (e.openInNewTab === true) {
                        button.attr('target', '_blank');
                    } else {
                        button.removeAttr('target');
                    }
                }
                button.attr("href", buttonUrl);
                button.text(buttonText);

                var container = field.closest(".hero-button-container");
                cmsHtmlField.setupCMsButtonLayout(container);
            },
            error: cmsHtmlField.ShowEditBarFailure
        });

    },
    editCmsButtonClick: function (e) {
        e.preventDefault();
        var button = $(e.target);
        var id = button.data('id');
    

        $('#cms-button-modal-form').foundation('reveal', 'open', {
            url: '/cms/EditCmsButton?id=' + id
        });
    },
    setupCmsButtonForEdit: function (field) {
        var cmsHtmlField = rtApp.CmsHtmlField;
        field.off("click");
        field.click(cmsHtmlField.editCmsButtonClick);
        field.show();

        var id = field.data("id");
      
        $.ajax({
            url: "/Cms/GetDraftCmsButton",
            type: "POST",
            dataType: "json",
            data: {
                id: id
            },

            success: function (e) {
                var buttonText = e.text;
                if (buttonText === "") {
                    buttonText = "Click here to edit";
                }
                field.text(buttonText);
                var container = field.closest(".hero-button-container");
                cmsHtmlField.setupCMsButtonLayout(container);
            },
            error: cmsHtmlField.ShowEditBarFailure
        });

    },
    setHeroImageToPublishedValue: function (field) {

        if (field.data('show-hero') === false) {
            field.hide();
        };
        var heroDiv = field.find('.hero').first();
        var heroButton = field.find('.cms-hero-image-button').first();
        var id = heroButton.data("id");
        var cmsHtmlField = rtApp.CmsHtmlField;
        $.ajax({
            url: "/Cms/GetPublishedHeroInlineImages",
            type: "POST",
            dataType: "json",
            data: {
                id: id
            },

            success: function (e) {

                if (e.imagefilename.length === 0) {
                    heroDiv.css("background-image", "url(/assets/img/hero-image-desktop.jpg)");
                    heroButton.data("filename", "");
                } else {
                    heroDiv.css("background-image", "url(" + e.imageurl + ")");
                    heroButton.data("filename", e.imagefilename);
                }
           
            },
            error: cmsHtmlField.ShowEditBarFailure
        });

    },
    setupHeroImageForEdit: function (field) {


        field.show();
        var heroDiv = field.find('.hero').first();
        var heroButton = field.find('.cms-hero-image-button').first();
        var id = heroButton.data("id");
        var cmsHtmlField = rtApp.CmsHtmlField;
        $.ajax({
            url: "/Cms/GetDraftHeroInlineImages",
            type: "POST",
            dataType: "json",
            data: {
                id: id
            },

            success: function (e) {
               
                if (e.imageurl.length === 0) {
                   
                    heroDiv.css("background-image", "url(/assets/img/rt-add-image.png)");
                    heroButton.data("filename", "");
                    
                } else {
                    heroDiv.css("background-image", "url(" + e.imageurl + ")");
                    heroButton.data("filename", e.imagefilename);

                    //field.data("alttext", e.alttext);
                    //field.data("filename", e.imagefilename);
                    //field.data("caption", e.caption);
                    //field.attr("src", e.imageurl);
                    //field.attr("alttext", e.alttext);

                    //$(field.data("caption-id")).html = e.caption;
                }
                heroButton.data("container", e.container);
                heroButton.click(rtApp.CmsHtmlField.editHeroImageClick);
            },
            error: cmsHtmlField.ShowEditBarFailure
        });

    },
    editHeroImageClick: function (e) {

        var button = $(e.target);

        var imageElementId = button.data("hero-div-id");
        var heroImageId = button.data("id");

        var imageFileName = button.data("filename");
        var container = button.data("container");

        $('#hero-cms-modal-form').foundation('reveal', 'open', {
            url: '/cms/AddEditHeroImageModal?Container=' + container + '&ImageFileName=' + imageFileName +
                '&heroImageId=' + heroImageId+
                '&imageElementId=' + imageElementId
        });
    }
    ,
    SetCmsToolBarToDefault: function() {

        var editButton = $("#cms-fields-edit");

        //reset edit click nd menu look
        editButton.click(rtApp.CmsHtmlField.OnEditClick);
        editButton.removeClass("has-dropdown not-click");
        editButton.data("mode", "default");
        //editButton.text("Edit");
        $("#cms-loading-gif").hide();

        $("#edit-dropdown").hide();
        //$("#cms-fields-publish").hide();

        
        $(".editable-field-label").hide();

        $(".editable-field-annotation-label").hide();
        
        $(".raw-html-output-container-outline").removeClass("editable-field-active");
            
        $(".inline-image-output-container-outline").removeClass("editable-field-active");
      

        rtApp.WorkingModal.CloseWorkingModal();
    },
    OnPublishClick: function () {
        var cmsHtmlField = rtApp.CmsHtmlField;
        $("#cms-loading-gif").show();
        rtApp.WorkingModal.OpenWorkingModal();
        var inlineInputs = $(".raw-html-output-container");
        var inLineImages = $(".inline-image");
        var inLineHeroImages = $(".hero-container");
        var cmsButtons = $(".cms-button");

        $(".hero-image-edit-button").hide();
        cmsHtmlField.FieldsPublishedCount = 0;
        inlineInputs.each(function () {
                cmsHtmlField.publishField($(this));
            }
        );
        inLineImages.each(function () {
            cmsHtmlField.publishImage($(this));
        } );
        inLineHeroImages.each(function () {
            cmsHtmlField.publishHeroImage($(this));
        });
        cmsButtons.each(function () {
            cmsHtmlField.publishCmsButton($(this));
        });
    }, publishCmsButton: function (field) {

        var cmsHtmlField = rtApp.CmsHtmlField;
        var button = $(field);
        var id = button.data("id");

        $.ajax({
            url: "/Cms/PublishCmsButton",
            type: "POST",
            dataType: "json",
            data: {
                id: id
            },

            success: function (e) {
                cmsHtmlField.setupCmsButtonToPublishedValues(field);
            },
            error: cmsHtmlField.ShowEditBarFailure
        });

    },
    publishHeroImage: function (field) {

        
        var heroButton = field.find('.cms-hero-image-button').first();
        var id = heroButton.data("id");
        var cmsHtmlField = rtApp.CmsHtmlField;
  
        $.ajax({
            url: "/Cms/PublishCmsInlineHeroImage",
            type: "POST",
            dataType: "json",
            data: {
                id: id
            },

            success: function (e) {
                cmsHtmlField.setHeroImageToPublishedValue($(field));
            },
            error: cmsHtmlField.ShowEditBarFailure
        });

    },
    publishImage: function (field) {


        var id = field.attr("id");
        var cmsHtmlField = rtApp.CmsHtmlField;
        if (field.data("filename").length === 0) {
            field.hide();

        }
        $.ajax({
            url: "/Cms/PublishCmsInlineImage",
            type: "POST",
            dataType: "json",
            data: {
                id: id
            },

            success: function (e) {
                field.off("click");
             
            },
            error: cmsHtmlField.ShowEditBarFailure
        });

    },
    publishField: function(field) {


        var id = field.data("html-field-id");
        var cmsHtmlField = rtApp.CmsHtmlField;
        $.ajax({
            url: "/Cms/PublishHtmlField",
            type: "POST",
            dataType: "json",
            data: {
                id: id
            },

            success: function(e) {
                // $("#raw-html-output-container-" + id).html(tinyMCE.get(id).getContent()); not inloine
                console.log("Removing:- " + id);
                tinyMCE.get(id).remove();
                console.log("Removed:- " + id);
                //$("#" + id).hide(); not inline
                //$("#raw-html-output-container-" + id).show();not inline
                cmsHtmlField.FieldsPublishedCount = cmsHtmlField.FieldsPublishedCount + 1;
                console.log(cmsHtmlField.FieldsPublishedCount);
                if (cmsHtmlField.FieldsPublishedCount === cmsHtmlField.TotalFieldCount()) {

                    cmsHtmlField.SetCmsToolBarToDefault();
                }
            },
            error: cmsHtmlField.ShowEditBarFailure
        });

    },
    setFieldToPublishedValue: function (field) {


        var id = field.data("html-field-id");
        var cmsHtmlField = rtApp.CmsHtmlField;
        $.ajax({
            url: "/Cms/GetHtmlPublishedFieldValue",
            type: "POST",
            dataType: "json",
            data: {
                id: id
            },

            success: function (e) {
       
                field.html(e);
                cmsHtmlField.FieldsRestoredToPublishedCount = cmsHtmlField.FieldsRestoredToPublishedCount + 1;

                if (cmsHtmlField.FieldsRestoredToPublishedCount === cmsHtmlField.TotalFieldCount()) {
                    cmsHtmlField.SetCmsToolBarToDefault();
                }
            },
            error: cmsHtmlField.ShowEditBarFailure
        });

    },

    setImageToPublishedValue: function (field) {


        var id = field.attr("id");
        var cmsHtmlField = rtApp.CmsHtmlField;
        $.ajax({
            url: "/Cms/GetPublishedCmsInlineImage",
            type: "POST",
            dataType: "json",
            data: {
                id: id
            },

            success: function (e) {


               
                if (e.imagefilename.length === 0) {
                    field.hide();
                    field.attr("src", "/assets/img/rt-add-image.png");
                } else {
                    field.attr("src", e.imageurl);
                }
                field.attr("alttext", e.alttext);
                field.data("alttext", e.alttext);
                field.data("filename", e.imagefilename);
                field.data("caption", e.caption);
                field.on("click", cmsHtmlField.editImageClick);
                field.off("click");
            },
            error: cmsHtmlField.ShowEditBarFailure
        });

    },
    setupFieldForEdit: function(field) {


        var id = field.data("html-field-id");
        var cmsHtmlField = rtApp.CmsHtmlField;
        $.ajax({
            url: "/Cms/GetHtmlDraftFieldValue",
            type: "POST",
            dataType: "json",
            data: {
                id: id
            },

            success: function (e) {


              field.html(e);
              
                
                cmsHtmlField.AddTinyMceToControls(field);
            },
            error: cmsHtmlField.ShowEditBarFailure
        });

    },
    setupImageForEdit: function (field) {


        var id = field.attr("id");
        var cmsHtmlField = rtApp.CmsHtmlField;
        $.ajax({
            url: "/Cms/GetDraftCmsInlineImage",
            type: "POST",
            dataType: "json",
            data: {
                id: id
            },

            success: function (e) {
                field.show();
                if (e.imageurl.length === 0) {
                    field.attr("src", "/assets/img/rt-add-image.png");
                    field.attr("alttext", "Add an image to bring your post alive");
                } else {
                    field.data("alttext", e.alttext);
                    field.data("filename", e.imagefilename);
                    field.data("caption", e.caption);
                    field.attr("src", e.imageurl);
                    field.attr("alttext", e.alttext);
                   
                    $(field.data("caption-id")).html = e.caption;
                }
                field.data("container", e.container);
                field.on("click", cmsHtmlField.editImageClick);
            },
            error: cmsHtmlField.ShowEditBarFailure
        });

    },
    editImageClick: function (e) {
        var image = $(e.target);
 
        var imageElementId = image.attr("id");
        var caption = image.data("caption");
        var captionElementId = image.data("caption-id");
        var alttext = image.attr("alttext");
        var imageFileName = image.data("filename");
        var container = image.data("container");

        $('#cms-image-modal-form').foundation('reveal', 'open', {
            url: '/cms/AddEditImageModal?Caption=' + caption +
                '&AltText=' + alttext +
                 '&Container=' + container + '&ImageFileName=' + imageFileName +
                 '&captionElementId=' + captionElementId +
                '&imageElementId=' + imageElementId
        });
    }
    ,
    onHtmlChange: function(e) {

        var cmsHtmlField = rtApp.CmsHtmlField;

        var content = tinyMCE.get(e.target.id).getContent();

        $.ajax({
            url: "/Cms/SetDraftHtmlField",
            type: "POST",
            dataType: "json",
            data: {
                id: e.target.id,
                html: content
            },

            success: cmsHtmlField.SetDraftHtmlFieldSuccess,
            error: cmsHtmlField.SetDraftHtmlFieldFailure
        });


    },
    ShowEditBar: function() {
        var inputs = $(".raw-html-input").length;
        var inlineInputs = $(".raw-html-output-container").length;
        var imageContainers = $(".inline-image-output-container-outline").length;
        var heroContainers = $(".hero-container").length;

        //if contains editable content
        if (inputs + inlineInputs + imageContainers + heroContainers > 0) {

            var cmsHtmlField = rtApp.CmsHtmlField;
            $.ajax({
                url: "/Cms/IsUserArticleAdminAsync",
                type: "POST",
                dataType: "json",
                data: {
                
                },
                success: cmsHtmlField.ShowEditBarSuccess,
                error: cmsHtmlField.ShowEditBarFailure
            });
        }

    },
    ShowEditBarSuccess: function(e) {

        if (e === true) {


            $("#cms-fields-edit").show();
            //$("#cms-top-bar").show();
            $("#edit-dropdown").show();
            $("#cms-fields-edit").click(rtApp.CmsHtmlField.OnEditClick);
            $("#cms-fields-stop-editing").click(rtApp.CmsHtmlField.OnEditClick);
            $("#cms-fields-publish").click(rtApp.CmsHtmlField.OnPublishClick);
           
        }
    },
    onEditImageButtonClick: function (e) {
        $('#model-form').foundation('reveal', 'open', {
            url: '/Home/AddEditImage'
        });
        return false;

    },
    ShowEditBarFailure: function(e) {
        $.growl.error({ message: "Error checking if user can edit" });
    },
    SetDraftHtmlFieldSuccess: function(e) {
        if (e.success === false) {
            $.growl.error({ message: "Error setting field value:" + e.message });
        }
    },
    SetDraftHtmlFieldFailure: function(e) {
        $.growl.error({ message: "Error setting field value:" + e.message });
    },

    AddTinyMceToControls: function(field) {

        tinymce.baseURL = "/bower_components/tinymce";
        var isInline = $("#" + field.context.id).data("is-inline");

        tinymce.init({
            selector: "#" + field.context.id,
            content_css: '/Content/master.css',
            inline: isInline,
            plugins: "advlist  code media contextmenu autolink link image table lists charmap",
            //theme: 'inlite',
            toolbar1:
                'insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image media',
            toolbar2: 'mybutton | code ',
            rel_list: [
        {title: 'None', value: ''},
        {title: 'No Follow', value: 'nofollow'}
            ],
            file_browser_callback: rtApp.TinyMCE.file_browser_callback_tinymce_handler,
            init_instance_callback: function(editor) {
                console.log(tinymce.editors.length + " of " + rtApp.CmsHtmlField.TotalFieldCount() + " total fields:");
                //wait for all instance to complete
                if (tinymce.editors.length === rtApp.CmsHtmlField.TotalFieldCount()) {

                   
                    $("#edit-dropdown").show();
                    var editButton = $("#cms-fields-edit");
                    $("#cms-loading-gif").hide();
                   editButton.data("mode", "edit");
                    
                  
                    rtApp.WorkingModal.CloseWorkingModal();
                };
            },
            setup: function(ed) {
                ed.on('change', rtApp.CmsHtmlField.onHtmlChange),
                    ed.addButton('mybutton', {
                        text: 'Clear content',
                        icon: true,
                        onclick: function () {
                 
                            ed.setContent('');
                        }
                    });
            }

        });
    }

}



$(document)
    .ready(function() {
        var cmsHtmlField = rtApp.CmsHtmlField;
        cmsHtmlField.DocReady();
    });