/**
 * Calendar controller interface.
 */
Aria.interfaceDefinition({
    $classpath : "atplugins.calendarwidget.controllers.ICalendarController",
    $extends : "aria.templates.IModuleCtrl",
    $events : {
        "dateModelChange" : "TODO",
        "eventsModelChange" : "TODO",
        "timeZoneChange" : "TODO"
    },
    $interface : {
        itemClick : function () {},

        itemDoubleClick : function () {},

        gridClick : function () {},

        gridDoubleClick : function () {},

        itemEditMove : function () {},

        itemEditResize : function () {},

        itemEditBegin : function () {},

        itemEditEnd : function () {},

        change : function () {},

        timeZoneChange : function () {}
    }
});