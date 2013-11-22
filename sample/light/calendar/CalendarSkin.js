(function () {
    var basePackage = "light";
    var basePath = basePackage + ".";
    var nspace = Aria.nspace(basePackage, true);

    /**
     * Skin object for calendar
     */
    Aria.classDefinition({
        $classpath : basePath + "calendar.CalendarSkin",
        $singleton : true,
        $prototype : {
            skinObject : {
                "std" : {
                    "dayFontWeight" : "normal",
                    "previousPageIcon" : "std:left_arrow",
                    "dayColor" : "black",
                    "monthTitleBackgroundColor" : "transparent",
                    "monthTitleColor" : "black",
                    "weekDaysLabelBorderColor" : "white",
                    "weekDaysLabelFontWeight" : "bold",
                    "dayPadding" : "0px",
                    "dayBackgroundColor" : "transparent",
                    "weekDaysLabelBackgroundColor" : "white",
                    "nextPageIcon" : "std:right_arrow",
                    "monthTitleBorderColor" : "#CCE6FF",
                    "monthTitlePaddingBottom" : "0px",
                    "todayColor" : "black",
                    "weekDaysLabelColor" : "black",
                    "selectedColor" : "black",
                    "weekEndColor" : "black",
                    "weekEndBorderColor" : "#FAFAFA",
                    "unselectableColor" : "#AB9B85",
                    "weekEndBackgroundColor" : "#FAFAFA",
                    "generalBackgroundColor" : "white",
                    "todayBackgroundColor" : "#FFFFCC",
                    "dayBorderColor" : "white",
                    "selectedBackgroundColor" : "#FFC966",
                    "weekDaysLabelPadding" : "0px",
                    "unselectableBackgroundColor" : "transparent",
                    "divsclass" : "list",
                    "monthTitlePaddingTop" : "0px",
                    "defaultTemplate" : "aria.widgets.calendar.CalendarTemplate",
                    "weekNumberBackgroundColor" : "#E7DBC6",
                    "unselectableBorderColor" : "white",
                    "todayBorderColor" : "#CCE6FF",
                    "selectedBorderColor" : "#CB7403",
                    "weekNumberBorderColor" : "#E7DBC6",
                    "monthPaddingLeft" : "10%",
                    "monthPaddingRight" : "10%",
                    "monthPaddingTop" : "5%",
                    "monthWidth" : "150px"
                }
            }
        }
    });
})();