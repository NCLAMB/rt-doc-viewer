"use strict";

var rtApp = rtApp || {};
rtApp.OffCanvasMenu = rtApp.OffCanvasMenu ||
{

    InitOffCanvasMenu: function () {
        $("nav#menu").mmenu({
            extensions: ["effect-menu-slide", "shadow-page", "shadow-panels", "theme-dark"],
            offCanvas: {
                pageSelector: "#MMenuWrapper"
            },
            counters: true,
            navbar: {
                title: "Research Tree"
            },
            navbars: [
              {
                  position: "top",
                  content: [
                      "prev",
                      "title",
                      "close"
                  ]
              }, {
                  position: 'bottom',
                  content: [
                      ''
                  ]
              }
            ]
        });

    },

};

$(window).on("load",
	function() {
        $("nav#menu").show();
        rtApp.OffCanvasMenu.InitOffCanvasMenu();
	});

