Aria.beanDefinitions({
    $package : "atplugins.calendarwidget.CalendarCfgBeans",
    $description : "Calendar config beans",
    $namespaces : {
        "json" : "aria.core.JsonTypes",
        "html" : "aria.templates.CfgBeans",
        "common" : "aria.widgetLibs.CommonBeans"
    },
    $beans : {
        "EventTimeZoneCfg" : {
            $type : "json:Object",
            $description : "Configuration for the time zones for an event.",
            $restricted : false,
            $properties : {
                "start" : {
                    $type : "json:Date",
                    $description : "Start date/time of an event for this particular time zone."
                },
                "end" : {
                    $type : "json:Date",
                    $description : "End date/time of an event for this particular time zone."
                },
                "name" : {
                    $type : "json:String",
                    $description : "The Name of the timezone."
                }
            }
        },
        "EventCfg" : {
            $type : "json:Object",
            $description : "Configuration for a calendar event.",
            $restricted : false,
            $properties : {
                "currentStart" : {
                    $type : "json:Date",
                    $description : "Current start time of an event."
                },
                "currentEnd" : {
                    $type : "json:Date",
                    $description : "Current end time of an event."
                },
                "timeZones" : {
                    $type : "json:Array",
                    $description : "Time zone information for the event.",
                    $contentType : {
                        $type : "EventTimeZoneCfg",
                        $description : "Contains the start, end, and timezone name."
                    }
                }
            }
        },
        "CalendarCfg" : {
            $type : "json:Object",
            $description : "Configuration for the calendar widget.",
            $restricted : false,
            $properties : {
                "events" : {
                    $type : "json:Array",
                    $description : "Calendar event item.",
                    $contentType : {
                        $type : "EventCfg",
                        $description : "Contains the item start, end, and timezone information."
                    }
                },
                "id" : {
                    $type : "json:String",
                    $description : "unique id (within the template) to associate to the widget",
                    $mandatory : false
                },
                "moduleCtrl" : {
                    $type : "html:ModuleCtrl",
                    $description : "Module controller to be used with the calendar widget. By default, use the internal widget module controller, unless a user defined module controller is specified, note the user defined controller must extend the internal widget controller."
                },
                "template" : {
                    $type : "json:PackageName",
                    $description : "Classpath of the default template used to display the Calendar widget."
                },
                "listen" : {
                    $type : "common:Callback",
                    $description : "Contains the callback method to handle custom events that are raised."
                }
            }
        }
    }
});