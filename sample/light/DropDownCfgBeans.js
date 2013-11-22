(function () {
    var basePackage = "light";
    var basePath = basePackage + ".";
    var nspace = Aria.nspace(basePackage, true);

    Aria.beanDefinitions({
        $package : basePath + "DropDownCfgBeans",
        $description : "Configuration for DropDown constructor.",
        $namespaces : {
            "json" : "aria.core.JsonTypes"
        },
        $beans : {
            "Configuration" : {
                $type : "json:Object",
                $description : "Configuration for a dropdown.",
                $restricted : false,
                $properties : {
                    "context" : {
                        $type : "json:ObjectRef",
                        $description : "The instance of aria.templates.TemplateCtxt in which the DropDown lives.",
                        $mandatory : true
                    },
                    "lineNumber" : {
                        $type : "json:Integer",
                        $description : "LineNumber line number in the template. Useful if instances of other widgets have to be created."
                    },
                    "domReference" : {
                        $type : "json:Object",
                        $description : "HTMLElement that should be used as a reference to display the popup.",
                        $mandatory : true
                    },
                    "ignoreClicksOn" : {
                        $type : "json:Array",
                        $description : "Array of HTMLElements. The popup should not close when one of the leemnts are clicked.",
                        $contentType : {
                            $type : "json:ObjectRef",
                            $description : "(HTMLElement)"
                        },
                        $default : [{}]
                    }
                }
            }
        }
    });
})();