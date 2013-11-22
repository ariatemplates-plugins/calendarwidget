Aria.classDefinition({
    $classpath : "atplugins.calendarwidget.Calendar",
    $extends : 'aria.html.Template',
    $statics : {
        INVALID_CONFIGURATION : "%1Invalid configuration for the Calendar Widget."
    },
    $dependencies : ['atplugins.calendarwidget.CalendarCfgBeans', 'aria.utils.Event', 'aria.DomEvent'],
    $constructor : function (cfg, context, lineNumber) {
        cfg.classpath = (cfg.template) ? cfg.template : "atplugins.calendarwidget.views.Calendar";
        cfg.moduleCtrl = (cfg.moduleCtrl) ? cfg.moduleCtrl : "atplugins.calendarwidget.controllers.CalendarController";
        this.$Template.constructor.apply(this, arguments);
        var normalizeArg = {
            beanName : "atplugins.calendarwidget.CalendarCfgBeans.CalendarCfg",
            json : this._cfg
        };
        try {
            this._cfgOk = aria.core.JsonValidator.normalize(normalizeArg, true);
        } catch (e) {
            this.$logError(this.INVALID_CONFIGURATION, null, e);
        }
    },
    $prototype : {}
});