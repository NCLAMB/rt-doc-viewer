"use strict";

var rtApp = rtApp || {};
rtApp.Promo = rtApp.Promo ||
{

    SavePromoCode:function() {
 
        var promoCode = rtApp.GetUrlVars()["promo"];

        //try second style
        if (promoCode == undefined) {
            promoCode = rtApp.GetUrlVars()["promoCode"];
        }
        if (promoCode == undefined) {
            promoCode = rtApp.GetUrlVars()["promocode"];
        }
        if (promoCode !== undefined) {
            document.cookie = "promocode=" + promoCode + "; expires=Fri, 3 Aug 2025 20:47:11 UTC; path=/";
          
            //remove referrer cookie as the promo will take precedent
            document.cookie = "referrer=;" + "; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
        }
        var referralId = rtApp.GetUrlVars()["referral"];
        if (referralId !== undefined) {

            document.cookie = "referrer=" + referralId + "; expires=Fri, 3 Aug 2025 20:47:11 UTC; path=/";
            //remove promo cookie as the referral will take precedent
            document.cookie = "promocode=;" + "; expires=Thu, 01 Jan 1970 00:00:01 GMT;";

        }
    }
}
$(document)
    .ready(function() {


        rtApp.Promo.SavePromoCode();
    });