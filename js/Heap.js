"use strict";

var rtApp = rtApp || {};
rtApp.Heap = rtApp.Heap ||
{

    
    GetHeapData: function () {


        var heapId = $("#heap_id").val();

        if (heapId !== "") {

            $.ajax({
                url: "/Account/GetHeapDataAjaxHandler",
                type: "POST",
                dataType: "json",

                success: rtApp.Heap.GetHeapData_Success,
                error: rtApp.Heap.GetHeapData_Fail
            });

        }

    },
    GetHeapData_Fail: function () {

    },
    GetHeapData_Success: function (data) {

        var trackcmp_email = data.id;
        var trackcmp = document.createElement("script");
        trackcmp.async = true;
        trackcmp.type = 'text/javascript';
        trackcmp.src = '//trackcmp.net/visit?actid=609611936&e=' + encodeURIComponent(trackcmp_email) + '&r=' + encodeURIComponent(document.referrer) + '&u=' + encodeURIComponent(window.location.href);
        var trackcmp_s = document.getElementsByTagName("script");
        if (trackcmp_s.length) {
            trackcmp_s[0].parentNode.appendChild(trackcmp);
        } else {
            var trackcmp_h = document.getElementsByTagName("head");
            trackcmp_h.length && trackcmp_h[0].appendChild(trackcmp);
        }

        var heapId = $("#heap_id").val();

        window.heap.identify(data.id);
        window.heap.addUserProperties(data.userProperties);


    }
}

$(window).ready(function() {
    setTimeout(
        function() {
            rtApp.Heap.GetHeapData();
        },
        1000);

});