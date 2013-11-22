(function () {
    var basePackage = "light";
    var basePath = basePackage + ".";
    var nspace = Aria.nspace(basePackage, true);

    Aria.classDefinition({
        $classpath : basePath + "LightWidgetLib",
        $extends : "aria.widgetLibs.WidgetLib",
        $singleton : true,
        $prototype : {
            widgets : {
                "TextInput" : basePath + "textinput.TextInputWithOnChange",
                "DatePicker" : basePath + "datepicker.DatePicker",
                "DateField" : basePath + "datefield.DateField",
                "Calendar" : basePath + "calendar.Calendar"
            }
        }
    });
})();