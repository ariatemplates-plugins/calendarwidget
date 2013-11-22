(function () {
    var basePackage = "light";
    var basePath = basePackage + ".";
    var nspace = Aria.nspace(basePackage, true);

    Aria.beanDefinitions({
        $package : basePath + "calendar.CalendarCfgBeans",
        $description : "Configuration for the light calendar widget.",
        $namespaces : {
            "json" : "aria.core.JsonTypes",
            "common" : "aria.widgetLibs.CommonBeans",
            "base" : "aria.html.beans.ElementCfg"
        },
        $beans : {
            "Properties" : {
                $type : "base:Properties",
                $description : "Properties of a Text Input widget.",
                $properties : {
                    "bind" : {
                        $type : "base:Properties.$properties.bind",
                        $description : "Bindings",
                        $properties : {
                            "value" : {
                                $type : "common:BindingRef"
                            },
                            "startDate" : {
                                $type : "common:BindingRef"
                            }
                        }
                    },
                    "tagName" : {
                        $type : "base:Properties.$properties.tagName",
                        $description : "Tag that should surround the calendar",
                        $mandatory : false,
                        $default : "span"
                    },
                    "template" : {
                        $type : "json:PackageName",
                        $description : "Template to use to display the calendar.",
                        $default : basePath + "calendar.CalendarTemplate"
                    },
                    "label" : {
                        $type : "json:String",
                        $description : "Label text to associate to the calendar."
                    },
                    "showWeekNumbers" : {
                        $type : "json:Boolean",
                        $description : "Specifies whether week numbers should be displayed.",
                        $default : false
                    },
                    "value" : {
                        $type : "json:Date",
                        $description : "Date currently selected in the calendar."
                    },
                    "minValue" : {
                        $type : "json:Date",
                        $description : "Minimum date for the value property."
                    },
                    "maxValue" : {
                        $type : "json:Date",
                        $description : "Maximum date for the value property."
                    },
                    "displayUnit" : {
                        $type : "json:Enum",
                        $description : "Minimum time unit which must be displayed entirely in the calendar. May be either month (M) or week (W). The default template currently only supports month (M).",
                        $enumValues : ["M", "W"],
                        $default : "M"
                    },
                    "numberOfUnits" : {
                        $type : "json:Integer",
                        $description : "Number of display units to show at the same time.",
                        $default : 1
                    },
                    "startDate" : {
                        $type : "json:Date",
                        $description : "Approximate first date in the currently displayed calendar. However, as the calendar may have a display with whole weeks or whole months, dates before this date may also appear."
                    },
                    "firstDayOfWeek" : {
                        $type : "json:Integer",
                        $description : "First day of the week. 0 = Sunday, ... 6 = Saturday. The null value means that it is set according to the regional settings.",
                        $minValue : 0,
                        $maxValue : 6
                    },
                    "monthLabelFormat" : {
                        $type : "json:String",
                        $description : "Date pattern to be used when displaying each month.",
                        $default : "MMMM yyyy"
                    },
                    "dayOfWeekLabelFormat" : {
                        $type : "json:String",
                        $description : "Date pattern to be used when displaying each day of the week.",
                        $default : "EE"
                    },
                    "dateLabelFormat" : {
                        $type : "json:String",
                        $description : "Date pattern to be used when displaying each date in the calendar.",
                        $default : "d"
                    },
                    "completeDateLabelFormat" : {
                        $type : "json:String",
                        $description : "Date pattern to be used when displaying complete dates."
                    },
                    "showShortcuts" : {
                        $type : "json:Boolean",
                        $description : "Specifies if today and selected day shortcuts should be displayed",
                        $default : false
                    },
                    "restrainedNavigation" : {
                        $type : "json:Boolean",
                        $description : "Specifies if today and selected day shortcuts should be displayed",
                        $default : true
                    },
                    "sclass" : {
                        $type : "json:String",
                        $description : "skin class for the calendar",
                        $default : "std"
                    }
                }
            }
        }
    });
})();