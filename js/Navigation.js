"use strict";

var rtApp = rtApp || {};
rtApp.Navigation = rtApp.Navigation ||
{
    init: function() {
        rtApp.Navigation.booNav();
        rtApp.Navigation.columnSplit();
        rtApp.Navigation.heroNav();
        rtApp.Navigation.scrollAnchors();
        rtApp.Navigation.findClass();

    },
    booNav: function() {
        $('#booNavigation').booNavigation({
            slideSpeed: 400
        });
    },
    heroNav: function() {
        if ($("div").hasClass("hero-container")) {
            $(".main-nav-wrapper").addClass("float-nav");
        }
    },

    columnSplit: function() {
        var num_cols = 4,
            container = $('.navContent'),
            listItem = 'li',
            listClass = 'sub-list';
        container.each(function() {
            var items_per_col = new Array(),
                items = $(this).find(listItem),
                min_items_per_col = Math.floor(items.length / num_cols),
                difference = items.length - (min_items_per_col * num_cols);
            for (var i = 0; i < num_cols; i++) {
                if (i < difference) {
                    items_per_col[i] = min_items_per_col + 1;
                } else {
                    items_per_col[i] = min_items_per_col;
                }
            }
            for (var i = 0; i < num_cols; i++) {
                $(this).append($('<li></li>').append($('<ul></ul>').addClass(listClass)));
                for (var j = 0; j < items_per_col[i]; j++) {
                    var pointer = 0;
                    for (var k = 0; k < i; k++) {
                        pointer += items_per_col[k];
                    }
                    $(this).find('.' + listClass).last().append(items[j + pointer]);
                }
            }
        });
    },
    scrollAnchors: function() {
        $('.anchor-panels a').click(function() {
            //Toggle Class
            $(".active").removeClass("active");
            $(this).closest('div').addClass("active");
            var theClass = $(this).attr("class");
            $('.' + theClass).parent('div').addClass('active');
            //Animate
            $('html, body').stop().animate({
                    scrollTop: $($(this).attr('href')).offset().top - 60
                },
                700);
            return false;
        });
        $('.scrollTop a').scrollTop();
    },

// scrollNav();

    findClass: function() {
        if ($(".hero-container")[0]) {
            // Do something if class exists
            $(".breadcrumb-nav").addClass("float-bread-nav");
        } else {
            // Do something if class does not exist
        }
    }

}

$(document)
    .ready(function () {
        rtApp.Navigation.init();
    });