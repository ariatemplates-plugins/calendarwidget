(function () {
    var basePackage = "light";
    var basePath = basePackage + ".";
    var nspace = Aria.nspace(basePackage, true);

    Aria.beanDefinitions({
        $package : basePath + "datefield.DateFieldCfgBeans",
        $description : "Configuration for the light datefield widget.",
        $namespaces : {
            "json" : "aria.core.JsonTypes",
            "base" : "aria.html.beans.TextInputCfg"
        },
        $beans : {
            "Properties" : {
                $type : "base:Properties",
                $description : "Properties of a Text Input widget.",
                $properties : {
                    "tagName" : {
                        $type : "base:Properties.$properties.tagName",
                        $description : "Automatically set to input by the framework. It cannot be overridden in the configuration.",
                        $default : "input",
                        $mandatory : false
                    },
                    "pattern" : {
                        $type : "json:String",
                        $description : "Date pattern used to propose a best value for the date entry",
                        $default : "d/M/y"
                    },
                    "minValue" : {
                        $type : "json:Date",
                        $description : "Minimum date for the value property."
                    },
                    "maxValue" : {
                        $type : "json:Date",
                        $description : "Maximum date for the value property."
                    }
                }
            }
        }
    });
})();