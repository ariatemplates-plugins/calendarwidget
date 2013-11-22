(function () {
    var basePackage = "light";
    var basePath = basePackage + ".";
    var nspace = Aria.nspace(basePackage, true);

    Aria.beanDefinitions({
        $package : basePath + "datepicker.DatePickerCfgBeans",
        $description : "Configuration for the light datepicker widget.",
        $namespaces : {
            "json" : "aria.core.JsonTypes",
            "base" : "aria.html.beans.ElementCfg",
            "calendar" : basePath + "calendar.CalendarCfgBeans",
            "datefield" : basePath + "datefield.DateFieldCfgBeans",
            "textinput" : "aria.html.beans.TextInputCfg"
        },
        $beans : {
            "Properties" : {
                $type : "base:Properties",
                $description : "Properties of a Text Input widget.",
                $properties : {
                    "tagName" : {
                        $type : "base:Properties.$properties.tagName",
                        $description : "Automatically set to input by the framework. It cannot be overridden in the configuration.",
                        $default : "span",
                        $mandatory : false
                    },
                    "minValue" : {
                        $type : "json:Date",
                        $description : "Minimum date for the value property."
                    },
                    "maxValue" : {
                        $type : "json:Date",
                        $description : "Maximum date for the value property."
                    },
                    "lazy" : {
                        $type : "json:Boolean",
                        $description : "Whether the dependencies of the dropdown should be loaded at widget initialization or the first time it is needed.",
                        $default : false
                    },
                    "dateField" : {
                        $type : "datefield:Properties",
                        $description : "Configuration of the datefield component of the datepicker",
                        $restricted : false,
                        $properties : {
                            "minValue" : {
                                $type : "datefield:Properties.$properties.minValue",
                                $description : "Minimum date for the value property. It is automatically set by the datepicker"
                            },
                            "maxValue" : {
                                $type : "datefield:Properties.$properties.maxValue",
                                $description : "Maximum date for the value property. It is automatically set by the datepicker"
                            },
                            "bind" : {
                                $type : "textinput:Properties.$properties.bind",
                                $description : "Bindings to the data model. This is a readonly property as it is automatically set by the datepicker for the calendar."
                            }
                        },
                        $default : {}
                    },
                    "calendar" : {
                        $type : "calendar:Properties",
                        $description : "Configuration of the calendar component of the datepicker. It is of type light.calendar.CalendarCfgBeans.Properties",
                        $restricted : false,
                        $properties : {
                            "bind" : {
                                $type : "calendar:Properties.$properties.bind",
                                $description : "Bindings to the data model. This is a readonly property as it is automatically set by the datepicker for the calendar."
                            }
                        },
                        $default : {}
                    }
                }
            }
        }
    });
})();