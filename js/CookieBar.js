"use strict";

var rtApp = rtApp || {};
rtApp.CookieBar = rtApp.CookieBar ||
{
    InitCookieBar: function () {
        if (typeof $.cookieBar === "undefined") {

            console.log("Cookie bar function not found");

        } else {
            $.cookieBar({
                message:
                    'Please read our terms of use - By clicking OK or continuing to use our website, you consent to our use of cookies and our <a href="/General/Disclaimer" target="_blank">Website Terms and conditions</a>, <a href="/General/PrivacyPolicy" target="_blank">Privacy Policy and Statement on Cookies</a>. Please leave our website if you do not agree.',
                acceptOnContinue: true,
                //acceptOnScroll: true,
                acceptAnyClick: true,
                acceptButton: true,
                acceptText: '<span href="#" class="small radius button" >Ok</span>',
                effect: 'slide',
                fixed: false,
                bottom: false
            });
        }

    }


};


$(document).ready(function () {

  
});