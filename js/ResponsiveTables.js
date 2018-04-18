"use strict";

var rtApp = rtApp || {};
rtApp.ResponsiveTables = rtApp.ResponsiveTables ||
{
    FormatTables: function(tables) {

        tables.each(function (index) {
            var targetTable = $(this);

            // Bail if the target table object is empty
            if (targetTable == null) {
                return;
            }

            // Bail if the target table has less than 2 columns
            var columnCount = rtApp.ResponsiveTables.GetTableColumnCount(targetTable);
            if (columnCount < 2) {
                return;
            }

            // Bail if the target table is a child of another table
            if (targetTable.parents("table").length > 0) {
                return;
            }

            if (!targetTable.hasClass("table")) {
                targetTable.addClass("table");
            }

            if (!targetTable.hasClass("scrolling-table")) {
                $("<div class='horizontal-scroll'></div>").insertBefore(targetTable);
                var div = targetTable.prev();
                targetTable.appendTo(div);
                targetTable.addClass("scrolling-table");
            }

            //if (!targetTable.hasClass("responsive")) {
            //    targetTable.addClass("responsive");
            //}
        });
    },
    GetTableColumnCount: function (targetTable) {
        var tableCols = 0;

        targetTable.find("tr").each(function () {
            var currCount = 0;

            $(this).find("td").each(function () {
                currCount++;
                var colSpan = $(this).attr("colspan");
                if (colSpan > 0) {
                    currCount = currCount + (colSpan - 1);
                }
                if (currCount > tableCols)
                    tableCols = currCount;
            }); // next td

        }); // next tr

        return tableCols;
    }
}