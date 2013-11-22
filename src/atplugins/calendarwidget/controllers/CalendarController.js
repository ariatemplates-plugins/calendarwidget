/**
 * Calendar controller which manages calendar data.
 */
Aria.classDefinition({
    $classpath : "atplugins.calendarwidget.controllers.CalendarController",
    $extends : "aria.templates.ModuleCtrl",
    $implements : ["atplugins.calendarwidget.controllers.ICalendarController"],
    $dependencies : ["aria.widgets.Template"],
    $prototype : {

        $publicInterfaceName : "atplugins.calendarwidget.controllers.ICalendarController",
        init : function () {
            var normalizeArg = {
                beanName : "atplugins.calendarwidget.CalendarCfgBeans.CalendarCfg",
                json : this._data
            };
            try {
                this._cfgOk = aria.core.JsonValidator.normalize(normalizeArg, true);
            } catch (e) {
                this.$logError(this.INVALID_CONFIGURATION, null, e);
            }

            this.json.addListener(this._data, "date", {
                fn : this._onDateModelChange,
                scope : this
            });

            this.json.addListener(this._data.events, null, {
                fn : this._onEventsModelChange,
                scope : this
            });

            this.json.addListener(this._data, "timeZone", {
                fn : this._onTimeZoneChange,
                scope : this
            });

            this.$ModuleCtrl.init.apply(this, arguments);
        },

        _onDateModelChange : function () {
            this.$raiseEvent("dateModelChange");
        },

        _onEventsModelChange : function () {
            this.$raiseEvent("eventsModelChange");
        },

        _onTimeZoneChange : function () {
            this.$raiseEvent("timeZoneChange");
        },

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