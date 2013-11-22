(function () {
    var basePackage = "light";
    var basePath = basePackage + ".";
    var nspace = Aria.nspace(basePackage, true);

    Aria.classDefinition({
        $classpath : basePath + "datepicker.DatePicker",
        $extends : "aria.html.Element",
        $dependencies : [basePath + "LazyLoader", basePath + "datepicker.DatePickerCfgBeans",
                basePath + "datefield.DateField", "aria.utils.Json", "aria.DomEvent"],
        $statics : {
            INVALID_USAGE : "Widget %1 can only be used as a %2."
        },

        $constructor : function (cfg, context, line) {

            /**
             * Shortcut to json utilities
             * @type aria.utils.Json
             * @protected
             */
            this._jsonUtil = aria.utils.Json;

            /**
             * Data model of the datepicker to be shared with sub widgets
             * @type Object
             */
            this.data = {
                value : cfg.value || null,
                calendarValue : null,
                startDate : null
            };

            /**
             * Callback object for the update of the external data model
             * @type aria.core.CfgBeans.Callback
             * @protected
             */
            this._internalDataModelChange = {
                fn : this._updateExternalDataModel,
                scope : this
            };

            this._jsonUtil.addListener(this.data, "value", this._internalDataModelChange);

            this.$cfgBean = basePath + "datepicker.DatePickerCfgBeans.Properties";

            cfg.on = cfg.on || {};

            this._registerListeners(cfg);

            this.$Element.constructor.call(this, cfg, context, line);

            /**
             * Element representing the icon
             * @type HTMLElement
             * @protected
             */
            this._iconDomElt = null;

            /**
             * Instance of the underlying datefield widget
             * @type light.datefield.DateField
             * @protected
             */
            this._dateField = new nspace.datefield.DateField(this._getDateFieldConfig(), context, line);

            nspace.LazyLoader.register(this.$classpath, {
                classes : [basePath + "datepicker.DatePickerDropDown"],
                templates : [cfg.calendar.template]
            });

        },
        $destructor : function () {
            if (this._dropdown) {
                this._dropdown.close();
            }
            this._dateField.$dispose();
            this._jsonUtil.removeListener(this.data, "value", this._internalDataModelChange);
            this._internalDataModelChange = null;
            this.data = null;
            this._onDropDownCloseCallback = null;
            this._iconDomElt = null;
            this.$Element.$destructor.call(this);
        },
        $prototype : {

            /**
             * Write the markup, corresponding to the self closing tag of this element.
             * @param {aria.templates.MarkupWriter} out
             */
            writeMarkup : function (out) {
                this.$Element.writeMarkupBegin.call(this, out);
                this._dateField.writeMarkup(out);
                this._writeIconMarkup(out);
                this.$Element.writeMarkupEnd.call(this, out);
            },

            /**
             * DatePicker can only be used as self closing tags. Calling this function raises an error.
             * @param {aria.templates.MarkupWriter} out
             */
            writeMarkupBegin : function (out) {
                this.$logError(this.INVALID_USAGE, [this.$class, "container"]);
            },

            /**
             * DatePicker can only be used as self closing tags. Calling this function does not rais an error though
             * because it was already logged by writeMarkupBegin.
             * @param {aria.templates.MarkupWriter} out
             */
            writeMarkupEnd : Aria.empty,

            /**
             * Initialization method called after the markup of the widget has been inserted in the DOM.
             */
            initWidget : function () {
                this._dateField.initWidget();
                this.$Element.initWidget.call(this);
                this._iconDomElt = this._domElt.children[1];
                if (!this._cfg.lazy) {
                    nspace.LazyLoader.load(this.$classpath);
                }
            },

            /**
             * Function called when a value inside 'bind' has changed.
             * @param {String} name Name of the property
             * @param {Object} value Value of the changed property
             * @param {Object} oldValue Value of the property before the change happened
             */
            onbind : function (name, value, oldValue) {
                if (name === "value") {
                    this._jsonUtil.setValue(this.data, "value", value, this._internalDataModelChange);
                }
            },

            /**
             * Set property for this widget. This is called by BindableWidget after a bind has been registered because
             * between the moment the widget constructor is called, and the moment _registerBindings is called, some
             * time may have elapsed and bound values may have changed.
             * @param {String} propertyName in the configuration
             * @param {Object} newValue to set
             */
            setWidgetProperty : function (propertyName, newValue) {
                if (propertyName === "value") {
                    this._jsonUtil.setValue(this.data, "value", newValue);
                }

            },

            /**
             * Add special listeners on top of the ones specified in configuration.
             * @param {light.datepicker.DatePickerCfgBeans.Properties} listeners On listeners taken from the widget
             * configuration.
             * @protected
             */
            _registerListeners : function (cfg) {
                var listeners = cfg.on;
                this._chainListener(listeners, "click", {
                    fn : this._onclick,
                    scope : this
                });
            },

            /**
             * This is to implement the autoselect.
             * @param {aria.DomEvent} event focus event
             * @param {aria.core.CfgBeans.Callback} clickCallback On click callback
             * @protected
             */
            _onclick : function (event) {
                if (event.target.getData("role") == "icon") {
                    this._triggerDropDown();
                    this._dateField.focus();
                }
            },

            /**
             * Update teh external data model after a change in the internal one
             * @param {Object} change Contains the old and new value
             * @protected
             */
            _updateExternalDataModel : function (change) {
                var bind = this._bindingListeners.value;
                if (bind) {
                    var newValue = this._transform(bind.transform, change.newValue, "fromWidget");
                    aria.utils.Json.setValue(bind.inside, bind.to, newValue, bind.cb);
                }

            },

            /**
             * Listener called after the dropdown is closed
             * @protected
             */
            _onDropDownClose : function () {
                var closeEvent = null;
                if (this._dropdown) {
                    closeEvent = this._dropdown.closeEvent;
                    this._dropdown.$dispose();
                    this._dropdown = null;
                }
                if (!closeEvent || closeEvent != aria.DomEvent.KC_TAB) {
                    this._dateField.focus();
                }
                if (closeEvent && closeEvent != aria.DomEvent.KC_ESCAPE) {
                    this._jsonUtil.setValue(this.data, "value", this.data.calendarValue);
                    this._dateField.callChangeListener();
                }
            },

            /**
             * Writes the markup of the icon
             * @param {aria.templates.MarkupWriter} out
             */
            _writeIconMarkup : function (out) {
                out.write('<span data-role="icon" class="dropdown-icon" style="cursor: pointer;">▼</span>');
            },

            /**
             * Trigger the dropdown
             */
            _triggerDropDown : function () {
                if (!nspace.LazyLoader.isLoaded(this.$classpath)) {
                    nspace.LazyLoader.load(this.$classpath, {
                        fn : this._triggerDropDown,
                        scope : this
                    });
                } else {
                    if (!this._dropdown) {
                        this._dropdown = new nspace.datepicker.DatePickerDropDown(this._getDropDownConfig());
                    }
                    var dropdown = this._dropdown;
                    if (dropdown.isOpen()) {
                        dropdown.close();
                    } else {
                        this._jsonUtil.setValue(this.data, "calendarValue", this.data.value);
                        dropdown.open();
                    }

                }

            },

            /**
             * Create the configuration for the underlying datefield
             * @return {light.datefield.DateFieldCfgBeans.Properties}
             * @protected
             */
            _getDateFieldConfig : function () {
                var cfg = this._cfg;
                var dateFieldCfg = this._jsonUtil.copy(cfg.dateField);
                if (cfg.minValue) {
                    dateFieldCfg.minValue = cfg.minValue;
                }
                if (cfg.maxValue) {
                    dateFieldCfg.maxValue = cfg.maxValue;
                }

                dateFieldCfg.bind = {
                    value : {
                        to : "value",
                        inside : this.data
                    }
                };
                dateFieldCfg.on = dateFieldCfg.on || {};

                this._chainListener(dateFieldCfg.on, "keydown", {
                    fn : this._onDateFieldKeydown,
                    scope : this
                });
                dateFieldCfg.attributes = cfg.attributes || {};
                dateFieldCfg.attributes.autocomplete = "off";

                return dateFieldCfg;
            },

            /**
             * Build the configuration for the dropdown
             * @return {light.DropDownCfgBeans.Configuration}
             * @protected
             */
            _getDropDownConfig : function () {

                var dropDownCfg = {
                    calendar : this._getCalendarCfg(),
                    domReference : this._domElt,
                    context : this._context,
                    lineNumber : this._lineNumber,
                    ignoreClicksOn : [this._iconDomElt],
                    onAfterClose : {
                        fn : this._onDropDownClose,
                        scope : this
                    }
                };
                return dropDownCfg;

            },

            /**
             * Build the configuration for the calendar widget
             * @return {light.calendar.CalendarCfgBeans.Properties}
             * @protected
             */
            _getCalendarCfg : function () {

                var cfg = this._cfg, calendarCfg = this._jsonUtil.copy(cfg.calendar);
                if (cfg.minValue) {
                    calendarCfg.minValue = cfg.minValue;
                }
                if (cfg.maxValue) {
                    calendarCfg.maxValue = cfg.maxValue;
                }

                calendarCfg.bind = {
                    value : {
                        to : "calendarValue",
                        inside : this.data
                    }
                };

                calendarCfg.startDate = this.data.value;
                return calendarCfg;
            },

            /**
             * Open the dropdown after down arrow
             * @param {Object} event
             * @protected
             */
            _onDateFieldKeydown : function (event) {
                var domEvent = aria.DomEvent;
                var dropdown = this._dropdown;
                if (dropdown && dropdown.isOpen()) {
                    dropdown.processKeyEvent(event);
                } else {
                    if (event.keyCode == domEvent.KC_ARROW_DOWN) {
                        this._dateField.applyTextToData();
                        this._triggerDropDown();
                        event.preventDefault();
                    }
                }
            },

            /**
             * @return {String} Id of the widget
             */
            getId : function () {
                return this._cfg.id;
            }

        }
    });
})();